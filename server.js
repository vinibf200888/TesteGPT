const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const transcribe = require('pocketsphinx-stt');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const upload = multer({ dest: path.join(__dirname, 'uploads') });
fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/transcribe', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  try {
    let result;
    if (process.env.OPENAI_API_KEY) {
      const resp = await openai.audio.transcriptions.create({
        file: fs.createReadStream(req.file.path),
        model: 'whisper-1',
        response_format: 'verbose_json',
        language: 'pt',
        timestamp_granularities: ['word']
      });
      const words = [];
      if (resp.segments) {
        resp.segments.forEach(seg => {
          if (Array.isArray(seg.words)) {
            seg.words.forEach(w => {
              words.push({ text: w.word, start: w.start, end: w.end });
            });
          }
        });
      }
      result = { words, text: resp.text };
    } else {
      result = await transcribe(req.file.path);
    }
    fs.unlink(req.file.path, () => {});
    res.json(result);
  } catch (err) {
    console.error(err);
    fs.unlink(req.file.path, () => {});
    res.status(500).json({ error: 'Erro ao transcrever' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
