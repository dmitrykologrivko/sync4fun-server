const {Room, User, File} = require('../models');

class RoomsFactory {
    static makeRoom(name = '#1', users = UsersFactory.makeUsers(2)) {
        return new Room(name, users);
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
    static makeFile(name = 'rabbit.mp4', size = 125789) {
        return new File(name, size);
    }
}

class UsersFactory {
    static makeUser(id = 'ID:1', name = 'John', file = FilesFactory.makeFile()) {
        return new User(id, name, file);
    }

    static makeUsers(size) {
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
