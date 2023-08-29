const express = require("express");
const app = express();

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});

// serve your css as static
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// SOCKETS
// const socket = new WebSocket('ws://localhost:3001');
// socket.onmessage = ({
//   data
// }) => {
//   console.log(`Message from server {data}`);
// }
// socket.send("Client says: welcome");
