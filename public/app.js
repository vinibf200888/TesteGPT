const startBtn = document.getElementById('start-btn');
const transcriptArea = document.getElementById('transcript');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.continuous = true;
  recognition.interimResults = true;

  let finalTranscript = '';

  recognition.onresult = event => {
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

  recognition.onerror = event => {
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
  startBtn.textContent = 'Reconhecimento não suportado';
}

// Video transcription
const videoInput = document.getElementById('video-input');
const videoPlayer = document.getElementById('video-player');
const transcribeBtn = document.getElementById('transcribe-btn');
const videoTranscript = document.getElementById('video-transcript');
let selectedVideo = null;

// YouTube transcription
const youtubeUrlInput = document.getElementById('youtube-url');
const loadYoutubeBtn = document.getElementById('load-youtube-btn');
const transcribeYoutubeBtn = document.getElementById('transcribe-youtube-btn');
const youtubeContainer = document.getElementById('youtube-container');
const youtubeTranscript = document.getElementById('youtube-transcript');

function extractVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

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

loadYoutubeBtn?.addEventListener('click', () => {
  const url = youtubeUrlInput.value.trim();
  const id = extractVideoId(url);
  if (!id) {
    alert('Link inválido');
    return;
  }
  youtubeContainer.innerHTML = `<iframe id="youtube-player" src="https://www.youtube.com/embed/${id}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  transcribeYoutubeBtn.disabled = false;
});

transcribeYoutubeBtn?.addEventListener('click', async () => {
  youtubeTranscript.value = '';
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: false });
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    transcribeYoutubeBtn.disabled = true;
    transcribeYoutubeBtn.textContent = 'Capturando...';
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.start();
    setTimeout(() => recorder.stop(), 10000);
    recorder.onstop = async () => {
      transcribeYoutubeBtn.textContent = 'Transcrevendo...';
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('video', blob, 'audio.webm');
      try {
        const res = await fetch('/api/transcribe', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          youtubeTranscript.value = data.words ? data.words.map(w => w.text).join(' ') : JSON.stringify(data);
        } else {
          youtubeTranscript.value = 'Erro ao transcrever';
        }
      } catch (err) {
        console.error(err);
        youtubeTranscript.value = 'Erro ao transcrever';
      }
      transcribeYoutubeBtn.disabled = false;
      transcribeYoutubeBtn.textContent = 'Transcrever YouTube';
      stream.getTracks().forEach(t => t.stop());
    };
  } catch (err) {
    console.error(err);
    youtubeTranscript.value = 'Erro ao capturar áudio';
    transcribeYoutubeBtn.disabled = false;
    transcribeYoutubeBtn.textContent = 'Transcrever YouTube';
  }
});
