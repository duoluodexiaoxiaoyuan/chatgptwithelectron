const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.onresult = function (event) {
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
};
recognition.start();
