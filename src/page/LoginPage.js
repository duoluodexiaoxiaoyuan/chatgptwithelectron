import { useState } from 'react';
import { Input, Button, message } from 'antd';
import { useHistory } from 'react-router-dom';

const LoginPage = () => {
  const [apiKey, setApiKey] = useState('');
  const history = useHistory();
  const handleInputChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleLogin = () => {
    if (apiKey) {
      localStorage.setItem('apiKey', apiKey);
      message.success('登录成功！');
      // 重定向到聊天页面
      history.push('/chat')
    } else {
      message.error('请输入API密钥！');
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h1>请输入OpenAI API密钥</h1>
        <Input
          placeholder="API密钥"
          style={{ width: '60%', marginRight: '10px' }}
          onChange={handleInputChange}
          onPressEnter={handleLogin}
        />
        <Button type="primary" onClick={handleLogin}>登录</Button>
      </div>
    </div>
  );
};

export default LoginPage;
