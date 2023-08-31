let startBtn = document.getElementById("start-btn");
let playerNameElem = document.getElementById("inp-name");
let lobbyCodeElem = document.getElementById("lobby-code");
let lobbyCode;
let playerName;
let ably;

startBtn.addEventListener("click", btnClick);
playerNameElem.addEventListener("input", onEdit);
lobbyCodeElem.addEventListener("input", onEdit);

