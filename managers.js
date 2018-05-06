const {Room, Watcher} = require('./models');

class WatcherUseThisRoomError extends Error {
}

class WatcherUseAnotherRoomError extends Error {
}

class RoomManager {
    constructor() {
        this._rooms = new Map();
    }

    setRooms(rooms) {
        this._rooms = rooms;
    }

    getRooms() {
        return this._rooms;
    }

    addWatcherToRoom(watcher, roomName) {
        const room = this.findWatcherRoom(watcher);

        if (room) {
            if (room.getName() === roomName)
                throw new WatcherUseThisRoomError();
            else
                throw new WatcherUseAnotherRoomError();
        }

        if (this._rooms.has(roomName)) {
            this._rooms.get(roomName).addWatcher(watcher);
        } else {
            this._rooms.set(roomName, new Room(roomName));
            this._rooms.get(roomName).addWatcher(watcher);
        }
    }

    findWatcherRoom(searchableWatcher) {
        for (const room of this._rooms.values()) {
            for (const watcher of room.getWatchers().values()) {
                if (watcher.getId() === searchableWatcher.getId()) {
                    return room;
                }
            }
        }

        return null;
    }
}

module.exports = {
    RoomManager,
    WatcherUseThisRoomError,
    WatcherUseAnotherRoomError
};