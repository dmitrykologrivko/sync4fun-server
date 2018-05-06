const Watcher = require('./models').Watcher;
const WatcherUseThisRoomError = require('./managers').WatcherUseThisRoomError;
const WatcherUseAnotherRoomError = require('./managers').WatcherUseAnotherRoomError;

module.exports = (io, socket, roomManager) => {

    socket.on('user join room', (req) => {
        let user = req.user;
        let room = req.room;

        let watcher = new Watcher(socket.handshake.sessionId, user.name);

        try {
            roomManager.addWatcherToRoom(watcher, room.name);
        } catch (e if e instanceof WatcherUseThisRoomError) {
            // TODO: Handle
        } catch (e if e instanceof WatcherUseAnotherRoomError) {
            // TODO: Handle
        }
    });

    socket.on('user leave room', (req) => {

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