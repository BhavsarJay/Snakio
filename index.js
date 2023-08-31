const express = require("express");
const app = express();
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())
// parse application/json
app.use(bodyParser.json())
// app.use(express.bodyParser());
app.use(express.json());
app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});
// serve your css as static
app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.get("/", (req, res) => {
  // res.sendFile(__dirname + "/index.html");
  res.render('index')

});
app.post("/", (req, res) => {
  console.log(req.body);
  res.render('snakio', {name : req.body.name});
  // res.sendFile(__dirname + "/lobby.html", {data : req.body});
});

// SOCKETS
// const socket = new WebSocket('ws://localhost:3001');
// socket.onmessage = ({
//   data
// }) => {
//   console.log(`Message from server {data}`);
// }
// socket.send("Client says: welcome");
