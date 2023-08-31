const Direction = Object.freeze({
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
});
const Tiletype = Object.freeze({
    EMPTY: 0,
    SNAKE1: 1,
    SNAKE2: 2,
    APPLE: 3,
    SNAKEBITE: 4,
});

// console.log(tileArr[2499]);
function Board() {
    this.tiles = [];
    this.size = { w: 50, h: 50 };
    this.alreadySet = false;
    this.updateTile = function(tile, type) {
    tile.type = parseInt(type);
    update(tile);
    }
    this.getTile = function(pos) {
    for (tile of this.tiles) {
        if (JSON.stringify(tile.position) === JSON.stringify(pos)) {
        // console.log(tile, "---Found Tile");
        return tile;
        }
    }
    console.log("No Tile with that position: ", pos);
    }
    this.init = function() {
    container = document.getElementsByClassName('grid')[0];
    if (!this.alreadySet) {
        var documentFragment = document.createDocumentFragment();
        for (let i = 1; i <= 50; i++) {
        for (let j = 1; j <= 50; j++) {
            const tileElem = document.createElement("div");
            // tileElem.id = i;
            tileElem.className = "tile";
            documentFragment.appendChild(tileElem);

            let position = { x: j, y: i };
            const tile = new Tile(position, tileElem);
            this.tiles.push(tile);
        }
        }
        container.appendChild(documentFragment);
        this.alreadySet = true;
    } else {
        for (let tile of this.tiles) {
        tile.elem.className = "tile";
        tile.type = Tiletype.EMPTY;
        }
    }
    }
    let update = function(tile) {
    switch (tile.type) {
        case Tiletype.EMPTY:
        tile.elem.className = "tile tile-empty";
        break;
        case Tiletype.SNAKE1:
        tile.elem.className = "tile tile-snake-white";
        break;
        case Tiletype.SNAKE2:
        tile.elem.className = "tile tile-snake-blue";
        break;
        case Tiletype.APPLE:
        tile.elem.className = "tile tile-apple";
        break;
        case Tiletype.SNAKEBITE:
        tile.elem.className = "tile tile-snakebite";
        default:
        console.log("Unknown tile type: ", tile.type);
        break;
    }
    }
}

function Tile(position, element) {
    this.position = position;
    this.elem = element;
    let type = Tiletype.EMPTY;

    Object.defineProperty(this, 'type', {
    get: function() {
        return type;
    },
    set: function(value) {
        type = value;
    }
    })
}

function Snako(position) {
    this.position;
    this.direction;
    this.color;
    this.queue = [];
    this.init = function(board, position, direction, color) {
    this.direction = direction;
    this.color = color;
    this.position = position;

    //Add next node
    this.queue = []
    this.queue.push(position);
    nextTile = board.getTile(position);

    //SET SNAKE
    if (this.color === 'white')
        board.updateTile(nextTile, Tiletype.SNAKE1);
    else if (this.color === 'blue')
        board.updateTile(nextTile, Tiletype.SNAKE2);
    }
    this.move = function(board, nextTile, targetPos) {
    //Remove Last node
    pos = this.queue.shift();
    tile = board.getTile(pos);
    board.updateTile(tile, Tiletype.EMPTY);
    //Add next node
    this.position = targetPos;
    this.queue.push(targetPos);
    nextTile = board.getTile(targetPos);

    //SET SNAKE
    if (this.color === 'white')
        board.updateTile(nextTile, Tiletype.SNAKE1);
    else if (this.color === 'blue')
        board.updateTile(nextTile, Tiletype.SNAKE2);
    }
    this.eat = function(board, nextTile, targetPos) {
    //Add next node without removing last
    this.position = targetPos;
    this.queue.push(targetPos);
    nextTile = board.getTile(targetPos);

    //SET SNAKE
    if (this.color === 'white')
        board.updateTile(nextTile, Tiletype.SNAKE1);
    else if (this.color === 'blue')
        board.updateTile(nextTile, Tiletype.SNAKE2);
    }
    this.clean = function(board) {
    //Remove Last node
    for(pos of this.queue){
        tile = board.getTile(pos);
        board.updateTile(tile, Tiletype.EMPTY);
    }
    }
}

function GetNextPos(position, direction) {
    switch (direction) {
    case Direction.UP:
        if (position.y > 1)
        return { x: position.x, y: position.y - 1 };
        else return 0;
        break;
    case Direction.DOWN:
        if (position.y < 50)
        return { x: position.x, y: position.y + 1 };
        else return 0;
        break;
    case Direction.LEFT:
        if (position.x > 1)
        return { x: position.x - 1, y: position.y };
        else return 0;
        break;
    case Direction.RIGHT:
        if (position.x < 50)
        return { x: position.x + 1, y: position.y };
        else return 0;
        break;
    default:
        console.log("Not a valid direction");
    }
}
function GetDirection(lastPos, currentPos) {
    if (JSON.stringify(lastPos) === JSON.stringify(currentPos)) {
    console.log("lastPos and currentPos cant be same.");
    return 0;
    }
    if (lastPos.x === currentPos.x) {
    if (lastPos.y < currentPos.y)
        return Direction.DOWN;
    else return Direction.UP;
    } else if (lastPos.y === currentPos.y) {
    if (lastPos.x < currentPos.x)
        return Direction.RIGHT;
    else return Direction.LEFT;
    }
}
function keyDownHandler(players, event) {
    // console.log("Keydown");
    if (event.defaultPrevented) return;
    for (let p of players) {
    if (p.get_controls() === 'wasd') {
        if (event.code === "KeyS") {
        p.set_dir(Direction.DOWN);
        } else if (event.code === "KeyW") {
        p.set_dir(Direction.UP);
        } else if (event.code === "KeyA") {
        p.set_dir(Direction.LEFT);
        } else if (event.code === "KeyD") {
        p.set_dir(Direction.RIGHT);
        }
    }
    else if (p.get_controls() === 'arrows') {
        if (event.code === "ArrowDown") {
        p.set_dir(Direction.DOWN);
        } else if (event.code === "ArrowUp") {
        p.set_dir(Direction.UP);
        } else if (event.code === "ArrowLeft") {
        p.set_dir(Direction.LEFT);
        } else if (event.code === "ArrowRight") {
        p.set_dir(Direction.RIGHT);
        }
    }
    }
    event.preventDefault();
}

function Apple() {
    this.position;
    let tile;
    this.init = function(board) {
    do {
        this.position = {
        x: parseInt(Math.random() * 50) + 1,
        y: parseInt(Math.random() * 50) + 1,
        }
        console.log("Apple:", this.position);
        tile = board.getTile(this.position);
    } while (tile.type != Tiletype.EMPTY);
    board.updateTile(tile, Tiletype.APPLE);
    }
}

function Player() {
    let snake = new Snako();
    let board;
    let apple;
    let myOptn;
    let inp_direction;
    let score_elem;
    let snakeType;
    let step_intvl;
    this.connection;
    this.isMine;

    this.mySnake = function() {
    return snake;
    }
    this.set_dir = function(val) {
    inp_direction = val;
    }
    this.get_controls = function() {
    return myOptn.input;
    }
    this.init = async function(_board, optn, _apple, _network, isMine) {
        board = _board;
        apple = _apple;
        if(_network != undefined) this.connection = _network;
        if(isMine != undefined) this.isMine = isMine;
        myOptn = optn;
        inp_direction = optn.startDir;
        snake.clean(board);
        snake.init(board, optn.startPos, optn.startDir, optn.color);
        controls = optn.input;
        score_elem = document.getElementById("score-" + optn.color);
        if(optn.color =='white') snakeType = Tiletype.SNAKE1;
        else snakeType = Tiletype.SNAKE2;
        
        if(this.isMine){
            step_intvl = setInterval(this.step, 80);
        }
        else{
            console.log(this.connection);
            // pos_intvl = setInterval(this.getPos, 200);
            await this.connection.channel.subscribe("nextPos", (message) => {
                let nextPos = JSON.parse(message.data);
                // this.step(nextPos);
            });
        }
    }
    this.step = (nextPos) => {
        if(nextPos === undefined){
            let dot = parseInt(snake.direction) + parseInt(inp_direction);
            if (dot === 1 || dot === 5) {
                nextPos = GetNextPos(snake.position, snake.direction);
            }
            else {
                nextPos = GetNextPos(snake.position, inp_direction);
                snake.direction = inp_direction;
            }
            this.connection.send("nextPos", JSON.stringify(nextPos));
        }


        if (nextPos === undefined || nextPos === 0) {
            // manager.reset();
            // Player Hit wall
            clearInterval(step_intvl);      
            setTimeout(()=> {
            this.init(board, myOptn, apple, this.connection, this.isMine);
            }, 2000);
            console.log("Issues in calculating nextPos");
        }
        else {
            nextTile = board.getTile(nextPos);
            if (nextTile.type === Tiletype.EMPTY)
            snake.move(board, nextTile, nextPos);
            else if (nextTile.type === Tiletype.APPLE) {
            snake.eat(board, nextTile, nextPos);
            // apple.init(board);       
            }
            else {
            clearInterval(step_intvl);                
            setTimeout(()=> {
                this.init(board, myOptn, apple, connection, isMine);
            }, 2000);
            //Show which snake part did we hit
            board.updateTile(nextTile, Tiletype.SNAKEBITE);
            }
        }

        // Update Score
        score_elem.innerHTML = snake.queue.length;
    }
}

function Manager() {
    const board = new Board();
    const apple = new Apple();
    this.members = [];
    let myPlayer;
    let step_intvl;
    let step_intvl2;
    let listner = false;
    this.init = async function(optns, network) {
        board.init();
        apple.init(board);

        for(member of this.members){
            let player = new Player();
            if(player.clientId === myId){
                myPlayer = player;
                player.init(board, JSON.parse(member.data), apple, network, true);
            }
            else{
                player.init(board, JSON.parse(member.data), apple, network, false);
            }
        }

        //Listen to keydowns
        if (!listner) {
            window.addEventListener("keydown",
            keyDownHandler.bind(null, this.members),
            true);
            listner = true;
        }
    }

    this.reset = function() {
        console.log("Game Over");
        clearInterval(step_intvl);
        clearInterval(step_intvl2);
        

        gameover_txt = document.getElementById('restart-text');
        gameover_txt.style.display = 'block';

        setTimeout(function() {
            manager.init();
            gameover_txt.style.display = 'none';
        }, 2000);
    }
}

function Network(){
    this.code = "69";
    this.ably;
    this.channel;
    this.manager;
    this.connectToServer = async function() {
        // Establish Connection
        // Using promises
        const API_KEY = 'MBW_Nw.CBpg4A:raS-h2l6bov2hKtakcbffFyMz3UCs0eLU2Fe153zn2M';
        const ably = new Ably.Realtime.Promise({
            key: API_KEY,
            clientId: myId,
        });
        await ably.connection.once("connected");
        console.log('Connected to Ably!');
        this.ably = ably;
        // get the channel to subscribe to
        this.channel = this.ably.channels.get('snakio');
    }

    function updateLobbyUI(members) {
        let playerList = document.getElementById("player-list");
        let memberList = members.map((member) => {
            return `<td class="player-name">${member.clientId}</td>`;
        }).join("");
        playerList.innerHTML = memberList;
    }

    this.enterPresence = async function(memberData) {
        // Enter the presence set of the "chatroom" channel
        await this.channel.presence.enter(memberData, (err) => {
            if (err) {
                return console.error("Error entering presence set.");
            }
            console.log("This client has entered the presence set.");

            
        });

        // Subscribe to the presence set to receive updates
        await this.channel.presence.subscribe((presenceMessage) => {
            const { action, clientId } = presenceMessage;
            console.log("Presence ", action, ": ", clientId);

            // Update the list of channel members when the presence set changes
            this.channel.presence.get((err, members) => {
                if (err) return console.error(`Error retrieving presence data: ${err}`);

                updateLobbyUI(members);

                if(action ==='enter' && members.length === 1){
                    playerOptn.isHost = true;
                    newOptns = JSON.stringify(playerOptn);
                    this.channel.presence.update(newOptns);
                }
                else if(action === "leave")
                {
                    let host_avail = false;
                    for (const member of members) {
                        if(JSON.parse(member.data).isHost === 'true'){
                            console.log("host: ", member.clientId);
                            host_avail = true;
                            break;
                        }
                    }
                    if(!host_avail){
                        console.log(members[0].clientId === myId);
                        // if i'm 0th member then make me host
                        if(members[0].clientId === myId){
                            console.log("Setting myself to host - ", myId);
                            playerOptn.isHost = true;
                            this.channel.presence.update(JSON.stringify(playerOptn));
                        }
                    }
                }

                this.manager.members = members;
            });
        });
    }           
    this.subscribe = async function (streamName){
        await this.channel.subscribe(streamName, (message) => {
            console.log(`${streamName}: ${message.data}`);
            if(streamName === "lobby" && message.data === "start"){
                manager.init(playerOptn, this);
            }
        }); 
    }
    this.send = async function(streamName, data){
        await this.channel.publish(streamName, data);
    }
}

const playerOptn = {
    startPos: {x:1, y:Math.random()*50},
    startDir: Direction.RIGHT,
    input: 'arrows',
    color: 'white',
    isHost: false,
}

async function connectAbly() {
    let ably = await network.connectToServer();
    await network.enterPresence(JSON.stringify(playerOptn));
    await network.subscribe("lobby");

    let btn_intvl = setInterval((btn_intvl) => {
        if(playerOptn.isHost){
            document.getElementById("start-btn").disabled = false;
            clearInterval(btn_intvl);
        }
    }, 2000);
}
async function onStart(){
    if(playerOptn.isHost) network.send("lobby", "start");
}

const myId = document.getElementById("pname").innerHTML;
const manager = new Manager();
let network = new Network();
network.manager = manager;    

connectAbly();