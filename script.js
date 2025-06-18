const button = document.getElementById('start');
const video = document.getElementById('video');

button.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    button.disabled = true;
  } catch (err) {
    alert('Could not access webcam: ' + err.message);
  }
});

