const button = document.getElementById('start');
const video = document.getElementById('video');
const canvasElement = document.getElementById('output');
const canvasCtx = canvasElement.getContext('2d');
const countElement = document.getElementById('count');

let count = 0;
let indexPose = false;

button.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await video.play();
    startDetection();
    button.disabled = true;
  } catch (err) {
    alert('Could not access webcam: ' + err.message);
  }
});

function startDetection() {
  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });
  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.5
  });
  hands.onResults(onResults);

  const camera = new Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: 640,
    height: 480
  });
  camera.start();
}

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1 });
      detectIndex(landmarks);
    }
  } else {
    indexPose = false;
  }

  canvasCtx.restore();
}

function detectIndex(landmarks) {
  const indexUp = landmarks[8].y < landmarks[6].y;
  const middleUp = landmarks[12].y < landmarks[10].y;
  const ringUp = landmarks[16].y < landmarks[14].y;
  const pinkyUp = landmarks[20].y < landmarks[18].y;

  if (indexUp && !middleUp && !ringUp && !pinkyUp) {
    if (!indexPose) {
      count++;
      countElement.textContent = count.toString();
      indexPose = true;
    }
  } else {
    indexPose = false;
  }
}
