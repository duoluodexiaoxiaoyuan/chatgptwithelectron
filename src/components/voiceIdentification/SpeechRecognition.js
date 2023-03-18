import React, { useState } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

function SpeechRecognitionDemo() {
  const [text, setText] = useState('');

  const handleStart = () => {
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(text + transcript);
    }
  }

  // while (true) {
  //   recognition.start()
  //   setTimeout(() => {
  //     recognition.stop()
  //   }, 500);
  // }

  return (
    <div>
      <button onClick={handleStart}>Start</button>
      <p>{text}</p>
    </div>
  );
}

export default SpeechRecognitionDemo;