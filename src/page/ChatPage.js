import React, { useState, useEffect, useRef } from 'react';
import {
  Input,
  Button,
  Avatar,
  message,
  Drawer,
  Select,
  Image,
  Modal,
} from 'antd';
import ReactMarkdown from 'react-markdown';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ChatContent from '../components/ChatContent';
const { Option } = Select
const ChatPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [botModel, setBotModel] = useState('chatBot');
  const [picSize, setPicSize] = useState('512x512');
  const [picCount, setPicCount] = useState('1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textToCopy, setTextToCopy] = useState('');
  const chatEndRef = useRef(null);
  const history = useHistory();

  // 自动滚动到底部
  useEffect(() => {
    console.log(chatHistory);
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  // 默认是不关联上下文的，节省token
  useEffect(() => {
    localStorage.setItem("associationContextLocalStorage", 0);
  }, [])

  const handleOk = () => {
    setIsModalOpen(false);
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        message.success('复制成功');
      })
      .catch((error) => {
        message.error('复制失败', error);
      });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSend = async () => {
    if (!localStorage.getItem('apiKey')) {
      message.error('key失效请重新登录');
      history.push('/login');
    }
    if (botModel == 'uiBot') {
      sendUI();
      return;
    }
    const newChatHistory = [
      ...chatHistory,
      { sender: 'user', message: inputValue },
      { sender: 'bot', message: '正在思考中...' },
    ];
    setChatHistory(newChatHistory);
    const arr = [
      { sender: 'user', message: '1' },
      { sender: 'bot', message: '2' },
    ];
    console.log(chatHistory);

    let newArr = associationContext();
    // 不关联上下文我们要将其置为空
    if (!localStorage.getItem('associationContextLocalStorage')) {
      newArr = []
    }
    // console.log(newArr);
    // 输出：[{role: 'user', content: '1'}, {role: 'assistant', content: '2'}]

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [...newArr, { role: 'user', content: inputValue }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('apiKey')}`,
          },
        }
      );
      const answer = response.data.choices[0].message.content;
      const updatedChatHistory = newChatHistory.map((message, index) => {
        if (index === newChatHistory.length - 1) {
          return { sender: 'bot', message: answer };
        }
        return message;
      });
      setChatHistory(updatedChatHistory);
    } catch (error) {
      console.error(error);
    }

    setInputValue('');
  };

  // 是否需要进行关联上下文
  const associationContext = () => {
    // 进行关联上下文
    const newArr = chatHistory.map((obj) => {
      const newObj = { ...obj };
      if (newObj.sender === 'bot') {
        newObj.role = 'assistant';
      } else {
        newObj.role = newObj.sender;
      }
      newObj.content = newObj.message;
      delete newObj.sender;
      delete newObj.message;
      return newObj;
    });
    return newArr;
  };

  // 调用接口生成图片
  const sendUI = async () => {
    const newChatHistory = [
      ...chatHistory,
      { sender: 'user', message: inputValue },
      { sender: 'bot', message: '正在帮你生成图片...' },
    ];
    setChatHistory(newChatHistory);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          prompt: inputValue,
          n: parseInt(picCount),
          size: picSize,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('apiKey')}`,
          },
        }
      );
      const answer = response.data.data;
      console.log(answer);
      const updatedChatHistory = newChatHistory.map((message, index) => {
        if (index === newChatHistory.length - 1) {
          return { sender: 'bot', message: answer };
        }
        return message;
      });
      setChatHistory(updatedChatHistory);
    } catch (error) {
      console.error(error);
    }

    setInputValue('');
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // 切换bot
  const handleChange = (value) => {
    setBotModel(value);
  };

  // 复制内容
  const copyContent = (event) => {
    if (botModel === 'uiBot') return;
    setTextToCopy(event.target.textContent);
    setIsModalOpen(true);
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Button
        type="primary"
        onClick={showDrawer}
        style={{ position: 'absolute', right: '5px', top: '45px' }}
      >
        设置模式
      </Button>
      <Drawer
        title="选择机器人"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <Select
          defaultValue="chatBot"
          style={{ width: 150, marginBottom: '15px', marginRight: '10px' }}
          onChange={handleChange}
          options={[
            { value: 'chatBot', label: 'chatBot(语言沟通)' },
            { value: 'uiBot', label: 'uiBot(生成图片)' },
          ]}
        />
        <Select
          defaultValue="512x512"
          style={{ width: 150, marginBottom: '15px' }}
          onChange={(value) => {
            setPicSize(value);
          }}
          options={[
            { value: '256x256', label: '256x256' },
            { value: '512x512', label: '512x512' },
            { value: '1024x1024', label: '1024x1024' },
          ]}
        />
        获取图片数量:{' '}
        <Input
          value={picCount}
          onChange={(event) => {
            setPicCount(event.target.value);
          }}
        />
        请选择是否需要进行关联上下文:<Select defaultValue="0" placeholder="请选择是否需要进行关联上下文" 
          onChange={(value) => {
            console.log(value)
            localStorage.setItem("associationContextLocalStorage", value);
          }}
        > 
          <Option value="1">是</Option> 
          <Option value="0">否</Option> 
        </Select>

      </Drawer>
      <Modal
        title="可以进行内容复制"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {textToCopy}
      </Modal>
      <div
        style={{
          height: '500px',
          width: '80%',
          marginTop: '50px',
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '0 0 10px #ddd',
          overflowY: 'scroll',
        }}
      >
        {chatHistory.map((message, index) => (
          <div
            key={index}
            ref={index === chatHistory.length - 1 ? chatEndRef : null} // 最后一条信息的标签上添加 ref 属性
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            {message.sender === 'bot' && (
              <Avatar
                style={{ backgroundColor: '#f56a00', marginRight: '10px' }}
                icon={<RobotOutlined />}
              />
            )}
            <div style={{ flex: 1 }}>
              <p
                style={{ margin: '0', marginBottom: '5px', fontWeight: 'bold' }}
              >
                {message.sender === 'user' ? '我' : '机器人'}
              </p>
              <div
                style={{
                  margin: '0',
                  padding: '5px 10px',
                  backgroundColor:
                    message.sender === 'user' ? '#e6f7ff' : '#f5f5f5',
                  borderRadius: '5px',
                  wordBreak: 'break-all',
                }}
                onClick={copyContent}
              >
                {message.sender !== 'user' &&
                botModel === 'uiBot' &&
                Array.isArray(message.message) ? (
                  message &&
                  message.message &&
                  message.message.map((item, index) => {
                    return <Image width={200} src={item.url} key={index} />;
                  })
                ) : Array.isArray(message.message) ? (
                  '是图片，需要查看请切换到uiBot模式'
                ) : (
                  <ChatContent message={message.message} />
                )}
              </div>
            </div>
            {message.sender === 'user' && (
              <Avatar
                style={{ backgroundColor: '#87d068', marginLeft: '10px' }}
                icon={<UserOutlined />}
              />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <Input
          value={inputValue}
          onChange={handleInputChange}
          style={{ marginRight: '10px', width: '500px' }}
          placeholder="请输入消息"
          onPressEnter={handleSend}
        />
        <Button onClick={handleSend}>发送</Button>
      </div>
    </div>
  );
};

export default ChatPage;
