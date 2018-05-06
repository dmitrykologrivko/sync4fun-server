const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const handlebars = require('express3-handlebars').create();
const RoomManager = require('./managers').RoomManager;

// Create room manager instance
const roomManager = new RoomManager();

// Set template engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Set static route
app.use(require('express').static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('home');
});

io.on('connection', (socket) => {
    require('./events')(io, socket, roomManager);
});

server.listen(process.env.PORT || 8000, () => {
    console.log('Server has been started');
});