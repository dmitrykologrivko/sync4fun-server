const Watcher = require('./models').Watcher;
const {
    WatcherUseThisRoomError,
    WatcherUseAnotherRoomError
} = require('./managers');

module.exports = (io, socket, roomManager) => {

    socket.on('user join room', (req) => {
        let user = req.user;
        let room = req.room;

        let watcher = new Watcher(socket.handshake.sessionId, user.name);

        try {
            roomManager.addWatcher(watcher, room.name);

            socket.emit('you joined to room', {});
            socket.to(room.name).emit('user joined to room', {});
        } catch (e if e instanceof WatcherUseThisRoomError) {
            socket.emit('you joined to room', {});
            socket.to(room.name).emit('user re-connected to room', {});
        } catch (e if e instanceof WatcherUseAnotherRoomError) {
            socket.emit('you use another room', {});
        }
    });

    socket.on('user leave room', (req) => {
        let user = req.user;

        let watcher = new Watcher(socket.handshake.sessionId, user.name);

        roomManager.removeWatcher(watcher);

        socket.emit('you left room', {});
        // TODO: Implement group emit
        socket.to('').emit('user left room', {});
    });

    socket.on('user updates file information', (req) => {

    });

    socket.on('user change play state to play', (req) => {

    });

    socket.on('user change play state to pause', (req) => {

    });

    socket.on('user change play state to stop', (req) => {

    });
};