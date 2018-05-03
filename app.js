const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIo(server);

app.get('/', (req, res) => {
    res.send('It works!');
});

io.on('connection', (socket) => {
    console.log('Connected to WS');
});

server.listen(process.env.PORT || 8000, () => {
    console.log('Server has been started');
});