const startBtn = document.getElementById('start-btn');
const transcriptArea = document.getElementById('transcript');

// Video transcription
const videoInput = document.getElementById('video-input');
const videoPlayer = document.getElementById('video-player');
const transcribeBtn = document.getElementById('transcribe-btn');
const videoTranscript = document.getElementById('video-transcript');
let selectedVideo = null;

startBtn?.addEventListener('click', async () => {
  if (!selectedVideo) return;
  const formData = new FormData();
  formData.append('video', selectedVideo);
  startBtn.disabled = true;
  startBtn.textContent = 'Transcrevendo...';
  try {
    const res = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      if (data.words) {
        transcriptArea.value = data.words.map(w => w.text).join(' ');
      } else {
        transcriptArea.value = JSON.stringify(data);
      }
    } else {
      transcriptArea.value = 'Erro ao transcrever';
    }
  } catch (err) {
    console.error(err);
    transcriptArea.value = 'Erro ao transcrever';
  }
  startBtn.disabled = false;
  startBtn.textContent = 'Iniciar Transcri\u00e7\u00e3o';
});

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
