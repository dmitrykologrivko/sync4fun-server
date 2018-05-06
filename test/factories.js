const {Room, Watcher} = require('../models');

class RoomsFactory {
    static makeRoom(name) {
        return new Room(name);
    }

    static makeRooms(size) {
        let rooms = new Map();

        for (let i = 1; i < size + 1; i++) {
            rooms.set(`#${i}`, this.makeRoom(`#${i}`));
        }

        return rooms;
    }
}

class WatchersFactory {
    static makeWatcher(id, name) {
        return new Watcher(id, name);
    }

    static makeWatchers(size) {
        let watchers = new Map();

        for (let i = 1; i < size + 1; i++) {
            watchers.set(`ID:${i}`, this.makeWatcher(`ID:${i}`, `Name:${i}`));
        }

        return watchers;
    }
}

module.exports = {
    RoomsFactory,
    WatchersFactory
};