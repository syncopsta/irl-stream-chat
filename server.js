const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const tmi = require('tmi.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

const channels = ['castcrafter', 'faister', 'nooreax'];

const client = new tmi.Client({
    channels: channels
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    io.emit('chatMessage', { channel, user: tags['display-name'], message });
});

client.on('subscription', (channel, username, method, message, userstate) => {
    io.emit('chatMessage', { channel, user: 'SYSTEM', message: `${username} has subscribed!`, type: 'subscription' });
});

client.on('resub', (channel, username, months, message, userstate, methods) => {
    io.emit('chatMessage', { channel, user: 'SYSTEM', message: `${username} has resubscribed for ${months} months!`, type: 'subscription' });
});

client.on('subgift', (channel, username, streakMonths, recipient, methods, userstate) => {
    io.emit('chatMessage', { channel, user: 'SYSTEM', message: `${username} has gifted a subscription to ${recipient}!`, type: 'subscription' });
});

app.use(express.static('public'));

server.listen(port, "0.0.0.0",() => {
    console.log(`Server started on http://localhost:${port}`);
});
