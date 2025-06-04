const startBtn = document.getElementById('start-btn');
const transcriptArea = document.getElementById('transcript');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.continuous = true;
  recognition.interimResults = true;

  let finalTranscript = '';

  recognition.onresult = (event) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const text = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += text + ' ';
      } else {
        interim += text;
      }
    }
    transcriptArea.value = finalTranscript + interim;
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error', event);
  };

  startBtn.addEventListener('click', () => {
    if (startBtn.dataset.listening === 'true') {
      recognition.stop();
      startBtn.dataset.listening = 'false';
      startBtn.textContent = 'Iniciar Microfone';
    } else {
      recognition.start();
      startBtn.dataset.listening = 'true';
      startBtn.textContent = 'Parar';
    }
  });

  recognition.onend = () => {
    if (startBtn.dataset.listening === 'true') {
      recognition.start();
    }
  };
} else {
  startBtn.disabled = true;
  startBtn.textContent = 'Reconhecimento n\u00e3o suportado';
}
