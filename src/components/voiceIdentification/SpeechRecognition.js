import React, { useState } from 'react';
import axios from 'axios';

function SpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const identificationResults = []
  // 语言识别
  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = 'zh-CN';
  recognition.continuous = true;
  // recognition.interimResults = true;
  recognition.onresult = (event) => {
    const resultIndex = event.resultIndex;
    const transcript = event.results[resultIndex][0].transcript;
    let interimTranscript = '';
    let finalTranscript = '';
    // Loop through the results to get the final and interim transcripts
    for (let i = event.resultIndex; i < event.results.length; i++) {
      let transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    // Do something with the final and interim transcripts
    console.log('Interim transcript:', interimTranscript);
    console.log('Final transcript:', finalTranscript);
    setTranscript(transcript);
    identificationResults.push(finalTranscript)
    // handleSend(finalTranscript)
  };

  recognition.onend = () => {
    console.log('结束了', identificationResults);
    handleSend(identificationResults.join('。'))
  }
  const startRecognition = () => {
    recognition.start();
  };

  // 合成语音
  // 初始化SpeechSynthesis对象
  const synth = window.speechSynthesis;
  // 定义语音合成函数
  const speak = (answer) => {
    // 判断是否正在进行语音合成
    if (synth.speaking) {
        console.error('语音合成正在进行中，无法开始新的语音合成')
        return;
    } 
    // 创建SpeechSynthesisUtterance对象
    const utterance = new SpeechSynthesisUtterance(answer);
    // 设置语音属性
    utterance.pitch = 1; // 音调
    utterance.rate = 1; // 语速
    utterance.volume = 1; // 音量
    // 播放语音合成
    synth.speak(utterance);
  }

  const handleSend = async (content) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: content }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('apiKey')}`,
          },
        }
      );
      const answer = response.data.choices[0].message.content;
      speak(answer)
      console.log(answer)
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={startRecognition}>Start Recognition</button>
      <button onClick={speak}>语音合成</button>
      <p>{transcript}</p>
    </div>
  );
}

export default SpeechRecognition;
