let startBtn = document.getElementById("start-btn");
let playerNameElem = document.getElementById("inp-name");
let lobbyCodeElem = document.getElementById("lobby-code");
let lobbyCode;
let playerName;
let ably;

startBtn.addEventListener("click", btnClick);
playerNameElem.addEventListener("input", onEdit);
lobbyCodeElem.addEventListener("input", onEdit);

function onEdit() {
    let flag = playerNameElem.value.length * lobbyCodeElem.value.length;
    if(flag === 0) return;
    else {
        startBtn.disabled = false;
    }
}

async function btnClick(){
    ably = await connectToServer();
    playerName = playerNameElem.value;
    lobbyCode = lobbyCodeElem.value;
    location.href += 'lobby.html';
}

// Establish onnection
async function connectToServer() {
    // Using promises
    const API_KEY = 'MBW_Nw.CBpg4A:raS-h2l6bov2hKtakcbffFyMz3UCs0eLU2Fe153zn2M';
    const ably = new Ably.Realtime.Promise(API_KEY);
    await ably.connection.once("connected");
    console.log('Connected to Ably!');
    return ably;
}

export { playerName, lobbyCode , ably};