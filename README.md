# Webcam Viewer

This is a simple web application that opens your webcam directly in the browser using the `getUserMedia` API. Click the **Open Webcam** button to grant access and start the video stream.

After granting access, the page uses MediaPipe Hands to detect hand landmarks. Every time a hand is detected with only the index finger extended, the counter on the page increments.

