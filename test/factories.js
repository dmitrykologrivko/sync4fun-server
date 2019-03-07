const {Room, User, PlayState, File} = require('../models');

const {PLAY_STATE_PAUSE} = require('../constants').playStates;

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

class PlayStateFactory {
    static makePlayState(state = PLAY_STATE_PAUSE) {
        return new PlayState(state);
    }
}

class FilesFactory {
    static makeFile(name = 'rabbit.mp4', size = 125789) {
        return new File(name, size);
    }
}

class UsersFactory {
    static makeUser(id = 'ID:1',
                    name = 'John',
                    file = FilesFactory.makeFile(),
                    state = PlayStateFactory.makePlayState()) {

        return new User(id, name, file, state);
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
    PlayStateFactory,
    FilesFactory,
    UsersFactory
};
