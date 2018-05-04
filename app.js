const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
    res.send('It works!');
});

io.on('connection', (socket) => {
    require('./events')(socket);
});

server.listen(process.env.PORT || 8000, () => {
    console.log('Server has been started');
});