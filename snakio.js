const Direction = Object.freeze({
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
});
const Tiletype = Object.freeze({
  EMPTY: 0,
  SNAKEWHITE: 1,
  SNAKEBLUE: 2,
  APPLE: 3,
  SNAKEBITE: 4,
});

// Function to convert an integer to an enum value
function intToDirection(directionInt) {
  for (const key in Direction) {
    if (Direction[key] === directionInt) {
      return key; // Return the enum value (e.g., 'UP')
    }
  }
  return null; // Handle invalid input or return a default value
}

// console.log(tileArr[2499]);
function Board() {
  this.tiles = [];
  this.size = { w: 50, h: 50 };
  this.alreadySet = false;
  this.updateTile = function (tile, type) {
    tile.type = parseInt(type);
    update(tile);
  };
  this.getTile = function (pos) {
    for (tile of this.tiles) {
      if (JSON.stringify(tile.position) === JSON.stringify(pos)) {
        // console.log(tile, "---Found Tile");
        return tile;
      }
    }
    console.error("No Tile with that position: ", pos);
  };
  this.init = function () {
    container = document.getElementsByClassName("grid")[0];
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
  };
  let update = function (tile) {
    switch (tile.type) {
      case Tiletype.EMPTY:
        tile.elem.className = "tile tile-empty";
        break;
      case Tiletype.SNAKEWHITE:
        tile.elem.className = "tile tile-snake-white";
        break;
      case Tiletype.SNAKEBLUE:
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
  };
}

function Tile(position, element) {
  this.position = position;
  this.elem = element;
  let type = Tiletype.EMPTY;

  Object.defineProperty(this, "type", {
    get: function () {
      return type;
    },
    set: function (value) {
      type = value;
    },
  });
}

function Snako() {
  this.position;
  this.direction;
  this.color;
  let queue = [];
  this.init = function (board, position, direction, color) {
    this.direction = direction;
    this.color = color;
    this.position = position;

    //Add next node
    queue = [];
    queue.push(position);
    nextTile = board.getTile(position);

    //SET SNAKE
    if (this.color === "white") board.updateTile(nextTile, Tiletype.SNAKEWHITE);
    else if (this.color === "blue")
      board.updateTile(nextTile, Tiletype.SNAKEBLUE);
  };
  this.move = function (board, nextTile, targetPos) {
    //Remove Last node
    pos = queue.shift();
    tile = board.getTile(pos);
    board.updateTile(tile, Tiletype.EMPTY);
    //Add next node
    this.position = targetPos;
    queue.push(targetPos);
    nextTile = board.getTile(targetPos);

    //SET SNAKE
    if (this.color === "white") board.updateTile(nextTile, Tiletype.SNAKEWHITE);
    else if (this.color === "blue")
      board.updateTile(nextTile, Tiletype.SNAKEBLUE);
  };
  this.eat = function (board, nextTile, targetPos) {
    //Add next node without removing last
    this.position = targetPos;
    queue.push(targetPos);
    nextTile = board.getTile(targetPos);

    //SET SNAKE
    if (this.color === "white") board.updateTile(nextTile, Tiletype.SNAKEWHITE);
    else if (this.color === "blue")
      board.updateTile(nextTile, Tiletype.SNAKEBLUE);
  };
  this.clean = function (board) {
    //Remove Last node
    for (pos of queue) {
      tile = board.getTile(pos);
      board.updateTile(tile, Tiletype.EMPTY);
    }
  };
  this.length = function () {
    return queue.length;
  };
}

function GetNextPos(position, direction) {
  switch (direction) {
    case Direction.UP:
      if (position.y > 1) return { x: position.x, y: position.y - 1 };
      else return 0;
      break;
    case Direction.DOWN:
      if (position.y < 50) return { x: position.x, y: position.y + 1 };
      else return 0;
      break;
    case Direction.LEFT:
      if (position.x > 1) return { x: position.x - 1, y: position.y };
      else return 0;
      break;
    case Direction.RIGHT:
      if (position.x < 50) return { x: position.x + 1, y: position.y };
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
    if (lastPos.y < currentPos.y) return Direction.DOWN;
    else return Direction.UP;
  } else if (lastPos.y === currentPos.y) {
    if (lastPos.x < currentPos.x) return Direction.RIGHT;
    else return Direction.LEFT;
  }
}
function keyDownHandler(player, event) {
  // console.log("Keydown");
  if (event.defaultPrevented) return;
  if (player.get_controls() === "wasd") {
    if (event.code === "KeyS") {
      player.set_dir(Direction.DOWN);
    } else if (event.code === "KeyW") {
      player.set_dir(Direction.UP);
    } else if (event.code === "KeyA") {
      player.set_dir(Direction.LEFT);
    } else if (event.code === "KeyD") {
      player.set_dir(Direction.RIGHT);
    }
  } else if (player.get_controls() === "arrows") {
    if (event.code === "ArrowDown") {
      player.set_dir(Direction.DOWN);
    } else if (event.code === "ArrowUp") {
      player.set_dir(Direction.UP);
    } else if (event.code === "ArrowLeft") {
      player.set_dir(Direction.LEFT);
    } else if (event.code === "ArrowRight") {
      player.set_dir(Direction.RIGHT);
    }
  }
  event.preventDefault();
}

function Apple() {
  this.position;
  let tile;
  let board;
  this.init = async function (_board) {
    board = _board;
    network.handleApple();
  };
  this.spawn = function () {
    do {
      this.position = {
        x: parseInt(Math.random() * 50) + 1,
        y: parseInt(Math.random() * 50) + 1,
      };
      console.log("Apple:", this.position);
      tile = board.getTile(this.position);
    } while (tile.type != Tiletype.EMPTY);

    this.show();
    network.publish("apple", this.position);
  };
  this.show = function () {
    tile = board.getTile(this.position);
    board.updateTile(tile, Tiletype.APPLE);
  };
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
  let tick = 1;
  let nextServerPos;
  // this.server_inp_buffer = {};
  this.client_inp_buffer = {};
  this.isMine;

  this.set_dir = function (val) {
    inp_direction = val;
  };
  this.get_pos = function () {
    return snake.position;
  };
  this.get_controls = function () {
    return myOptn.input;
  };
  this.init = async function (_board, optn, _apple, isMine) {
    board = _board;
    apple = _apple;
    this.isMine = isMine;
    myOptn = optn;

    // Add Keyboard Listners if this is mine.
    if (this.isMine) {
      window.addEventListener("keydown", keyDownHandler.bind(null, this), true);
    }

    if (playerOptn.isHost) {
      if (!this.isMine) {
        network.subscribeInput(myOptn.id);
      }
    } else {
      network.subscribePosition(myOptn.id);
    }
    network.subscribeReset(myOptn.id);

    if (playerOptn.isHost)
      network.channel.publish("reset-" + myOptn.id, { reset: true });
  };
  this.reset = function () {
    inp_direction = myOptn.startDir;
    snake.clean(board);
    snake.init(board, myOptn.startPos, myOptn.startDir, myOptn.color);
    controls = myOptn.input;
    score_elem = document.getElementById(myOptn.id).children[1];
    if (myOptn.color == "white") snakeType = Tiletype.SNAKEWHITE;
    else snakeType = Tiletype.SNAKEBLUE;

    this.start();
  };
  this.start = function () {
    clearInterval(step_intvl);
    step_intvl = setInterval(() => {
      if (playerOptn.isHost || this.isMine) this.step();
    }, speed);
    inp_intvl = setInterval(() => {
      if (!playerOptn.isHost && this.isMine) this.sendInput();
    }, 333);
  };
  this.step = function (serverPos) {
    let nextPos = {};
    if (false && nextServerPos != undefined) {
      nextPos = nextServerPos;
      nextServerPos = undefined;
    } else {
      let nextDir = this.isValidDirection(inp_direction)
        ? inp_direction
        : snake.direction;
      snake.direction = nextDir;
      nextPos = GetNextPos(snake.position, nextDir);
    }
    if (serverPos != undefined) nextPos = serverPos;
    let nextTile;
    if (nextPos === undefined || nextPos === 0) {
      // manager.reset();
      // Player Hit wall
      clearInterval(step_intvl);
      setTimeout(() => {
        if (playerOptn.isHost)
          network.channel.publish("reset-" + myOptn.id, { reset: true });
      }, 1000);
      console.log("hit wall");
      let currpos = snake.position;
      nextTile = board.getTile(currpos);
      board.updateTile(nextTile, Tiletype.SNAKEBITE);
    } else {
      nextTile = board.getTile(nextPos);
      if (nextTile.type === Tiletype.EMPTY)
        snake.move(board, nextTile, nextPos);
      else if (nextTile.type === Tiletype.APPLE) {
        snake.eat(board, nextTile, nextPos);
        if (playerOptn.isHost) apple.spawn();
      } else {
        clearInterval(step_intvl);
        setTimeout(() => {
          if (playerOptn.isHost)
            network.channel.publish("reset-" + myOptn.id, { reset: true });
        }, 1000);
        //Show which snake part did we hit
        board.updateTile(nextTile, Tiletype.SNAKEBITE);
      }
    }

    if (playerOptn.isHost) this.sendPosition(nextPos, tick);

    // Update Score
    score_elem.innerHTML = snake.length();
    tick++;
  };
  this.isValidDirection = function (direction) {
    let dot = parseInt(snake.direction) + parseInt(direction);
    if (dot === 1 || dot === 5) {
      return false;
    } else {
      return true;
    }
  };
  this.sendInput = function () {
    if (this.isMine) {
      //Send inp with client tick to server(host)
      let data = {};
      data.dir = inp_direction;
      data.tick = tick;
      this.client_inp_buffer[data.tick] = data.dir;
      // console.log(this.inp_buffer);
      // console.log("Sending Input Data: ", data);
      network.publish("input-" + myOptn.id, data);
    }
  };
  this.sendPosition = function (position, tick) {
    //Send pos with the same client tick to clients
    let data = {};
    data.pos = position;
    data.tick = tick;
    network.publish("position-" + myOptn.id, data);
    // console.log("ServerSend: ","position-",myOptn.id," | Data: ",data);
  };
  this.handlePosition = function (nextPos, tick) {
    // console.log("Position Received ", nextPos);
    if (myOptn.id != playerOptn.id) {
      // directly set the position for remote players
      // nextServerPos = nextPos;
      this.step(nextPos);
    } else {
      // nextServerPos = nextPos;
      this.step(nextPos);
      // for (let i = 1; i < tick; i++) {
      //   if (this.client_inp_buffer[i] != undefined) {
      //     delete this.client_inp_buffer[i];
      //   }
      // }
      // let reconciledPos = nextPos;
      // for (const tick in this.client_inp_buffer) {
      //   reconciledPos = GetNextPos(pos, this.client_inp_buffer[tick]);
      //   delete this.client_inp_buffer[tick];
      // }
      // this.step(nextPos);
      // if (JSON.stringify(reconciledPos) != JSON.stringify(snake.position)) {
      //   nextServerPos = reconciledPos;
      //   console.log("incorrect position...correcting based on server position");
      // }
    }
  };
  this.handleInput = function (dir, tick) {
    // console.log("Input Received ", myOptn.id, dir);
    inp_direction = dir;
    // move the client
    // this.server_inp_buffer[tick] = dir;
  };
}

function Manager() {
  const board = new Board();
  const apple = new Apple();
  this.members = [];
  let myPlayer;
  let step_intvl;
  this.getApple = function () {
    return apple;
  };
  this.init = async function (optns) {
    board.init();
    apple.init(board);
    if (playerOptn.isHost) apple.spawn();

    for (member of this.members) {
      let player = new Player();
      member.player = player;
      if (member.clientId === playerOptn.id) {
        myPlayer = player;
        console.log("init my player");
        player.init(board, member.data, apple, true);
      } else {
        console.log("init remote player");
        player.init(board, member.data, apple, false);
      }
    }
  };
  this.getPlayer = function (clientId) {
    for (const member of this.members) {
      if (member.clientId === clientId) return member.player;
    }
  };
}

function Network() {
  this.code = "69";
  this.ably;
  this.channel;
  this.connectToServer = async function () {
    // Establish Connection
    // Using promises
    const API_KEY = "MBW_Nw.CBpg4A:raS-h2l6bov2hKtakcbffFyMz3UCs0eLU2Fe153zn2M";
    this.ably = new Ably.Realtime.Promise({
      key: API_KEY,
      clientId: playerOptn.id,
    });
    await this.ably.connection.once("connected");
    console.log("Connected to Ably!");
    // get the channel to subscribe to
    this.channel = this.ably.channels.get("snakio");
  };

  function updateLobbyUI(members) {
    let playerList = document.getElementById("player-list");
    let memberList = members
      .map((member) => {
        return `
        <tr id="${member.clientId}">
          <td class="player-name">${member.clientId}</td>
          <td class="score">0</td>
        </tr>`;
      })
      .join("");
    playerList.innerHTML =
      "<tr><th>Players</th><th>Score</th></tr>" + memberList;
  }

  this.enterPresence = async function (memberData) {
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

        if (action === "enter" && members.length === 1) {
          playerOptn.isHost = true;
          this.channel.presence.update(playerOptn);
        } else if (action === "leave") {
          let host_avail = false;
          for (const member of members) {
            if (member.data.isHost === "true") {
              console.log("host: ", member.clientId);
              host_avail = true;
              break;
            }
          }
          if (!host_avail) {
            // if i'm 0th member then make me host
            if (members[0].clientId === playerOptn.id) {
              console.log("Setting myself to host - ", playerOptn.id);
              playerOptn.isHost = true;
              this.channel.presence.update(playerOptn);
            }
          }
        }

        this.manager.members = members;
      });
    });
  };
  this.handleLobby = async function () {
    await this.channel.subscribe("lobby", (message) => {
      if (message.data.start === true) {
        document.getElementById("start-btn").style.display = "none";
        manager.init(playerOptn);
      }
    });
  };
  this.subscribeInput = async function (id) {
    let channelName = "input-" + id;
    await this.channel.subscribe(channelName, (message) => {
      // console.log("Host Got input from ", message.clientId);
      let p = manager.getPlayer(id);
      p.handleInput(message.data.dir, message.data.tick);
    });
    console.log("Subscribed to :", channelName);
  };
  this.subscribePosition = async function (id) {
    let channelName = "position-" + id;
    await this.channel.subscribe(channelName, (message) => {
      // console.log("Client Got position for: ", channelName);
      let p = manager.getPlayer(id);
      p.handlePosition(message.data.pos, message.data.tick);
    });
    console.log("Subscribed to :", channelName);
  };
  this.subscribeReset = async function (id) {
    let channelName = "reset-" + id;
    await this.channel.subscribe(channelName, (message) => {
      // console.log("Client Got position for: ", channelName);
      let p = manager.getPlayer(id);
      p.reset();
    });
    console.log("Subscribed to :", channelName);
  };
  this.handleApple = async function () {
    await network.channel.subscribe("apple", (message) => {
      let apple = manager.getApple();
      if (message.clientId === playerOptn.id) return;
      let pos = message.data;
      console.log("Apple Position:", pos);
      apple.position = pos;
      apple.show();
    });
  };
  this.publish = async function (channelName, _data) {
    const data = {};
    for (const key in _data) {
      data[key] = _data[key];
    }
    this.channel.publish(channelName, data);
  };
}

const playerOptn = {
  id: document.getElementById("pname").innerHTML,
  startPos: { x: 1, y: parseInt(Math.floor(Math.random() * 50) + 1) },
  startDir: Direction.RIGHT,
  input: "arrows",
  color: "white",
  isHost: false,
};

async function connectAbly() {
  let ably = await network.connectToServer();
  await network.enterPresence(playerOptn);
  network.handleLobby();
  // this checks for isHost every sec
  // so the start-btn is set to enabled
  // even after the match has started.
  let btn_intvl = setInterval((btn_intvl) => {
    if (playerOptn.isHost) {
      document.getElementById("start-btn").disabled = false;
      clearInterval(btn_intvl);
    }
  }, 1000);
}
async function onStart() {
  if (playerOptn.isHost) network.publish("lobby", { start: true });
  document.getElementById("start-btn").style.display = "none";
}

const manager = new Manager();
const network = new Network();
var speed = 100;
network.manager = manager;

connectAbly();
