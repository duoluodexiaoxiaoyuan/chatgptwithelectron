import React, { useState } from 'react';

function SpeechRecognition() {
  const [transcript, setTranscript] = useState('');

  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const resultIndex = event.resultIndex;
    const transcript = event.results[resultIndex][0].transcript;
    setTranscript(transcript);
  };

  const startRecognition = () => {
    recognition.start();
  };

  return (
    <div>
      <button onClick={startRecognition}>Start Recognition</button>
      <p>{transcript}</p>
    </div>
  );
}

export default SpeechRecognition;
