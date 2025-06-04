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

// Video transcription
const videoInput = document.getElementById('video-input');
const videoPlayer = document.getElementById('video-player');
const transcribeBtn = document.getElementById('transcribe-btn');
const videoTranscript = document.getElementById('video-transcript');
let selectedVideo = null;

videoInput?.addEventListener('change', () => {
  const file = videoInput.files[0];
  if (file) {
    selectedVideo = file;
    videoPlayer.src = URL.createObjectURL(file);
    videoPlayer.load();
  }
});

transcribeBtn?.addEventListener('click', async () => {
  if (!selectedVideo) return;
  const formData = new FormData();
  formData.append('video', selectedVideo);
  transcribeBtn.disabled = true;
  transcribeBtn.textContent = 'Transcrevendo...';
  try {
    const res = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      if (data.words) {
        videoTranscript.value = data.words.map(w => w.text).join(' ');
      } else {
        videoTranscript.value = JSON.stringify(data);
      }
    } else {
      videoTranscript.value = 'Erro ao transcrever';
    }
  } catch (err) {
    console.error(err);
    videoTranscript.value = 'Erro ao transcrever';
  }
  transcribeBtn.disabled = false;
  transcribeBtn.textContent = 'Transcrever Vídeo';
});
