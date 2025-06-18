# Webcam Viewer

This is a simple web application that opens your webcam directly in the browser using the `getUserMedia` API. Click the **Open Webcam** button to grant access and start the video stream.

After granting access, the page uses MediaPipe Hands to detect hand landmarks. The counter increases every time the index finger is lowered and then raised again while the other fingers remain folded.

