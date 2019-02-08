const {Room, User, File} = require('../models');

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

class FilesFactory {
    static makeFile() {
        return new File('rabbit.mp4', 125789);
    }
}

class UsersFactory {
    static makeUser(id, name) {
        return new User(id, name, FilesFactory.makeFile());
    }

    static makeWatchers(size) {
        let watchers = new Map();

        for (let i = 1; i < size + 1; i++) {
            watchers.set(`ID:${i}`, this.makeUser(`ID:${i}`, `Name:${i}`));
        }

        return watchers;
    }
}

module.exports = {
    RoomsFactory,
    FilesFactory,
    UsersFactory
};
