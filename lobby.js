import { playerName, ably, lobbyCode } from "./server.js"

let channel;
let playerConfig;

// get the channel to subscribe to
channel = ably.channels.get(_lobbyCode);

/* 
Subscribe to a channel. 
The promise resolves when the channel is attached 
(and resolves synchronously if the channel is already attached).
*/
await channel.subscribe('playerConfig', (message) => {
    console.log('Received a greeting message in realtime: ' + message.data);
    playerConfig = message.data;
});

export {channel, playerConfig};