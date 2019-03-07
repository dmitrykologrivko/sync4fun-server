const {
    PLAY_STATE_PLAY,
    PLAY_STATE_PAUSE,
    PLAY_STATE_STOP
} = require('./constants').playStates;

class Room {
    constructor(name, users = new Map()) {
        this._checkUsers(users);

        this._name = name;
        this._users = users;
    }

    get name() {
        return this._name;
    }

    get users() {
        return this._users;
    }

    set users(users) {
        this._checkUsers(users);
        this._users = users;
    }

    addUser(user) {
        if (!(user instanceof User))
            throw new Error('Required argument "user" is not a "User" class instance!');

        this._users.set(user.id, user);
    }

    removeUser(user) {
        if (!(user instanceof User))
            throw new Error('Required argument "user" is not a "User" class instance!');

        this._users.delete(user.id);
    }

    isEmpty() {
        return this._users.size === 0;
    }

    _checkUsers(users) {
        if (!users || !(users instanceof Map))
            throw new Error('Required argument "users" is not a "Map" class instance!');

        for (const [key, value] of users) {
            if (!(value instanceof User)) {
                throw new Error(`Item with key "${key}" is not a "User" class instance!`);
            }
        }
    }
}

class PlayState {
    constructor(state) {
        if (!state)
            throw new Error('Required argument "state" is not defined!');
        if (![PLAY_STATE_PLAY, PLAY_STATE_PAUSE, PLAY_STATE_STOP].includes(state))
            throw new Error('Argument "state" is not one of play states!');

        this._state = state;
    }

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
    }
}

class File {
    constructor(name, size) {
        this._name = name;
        this._size = size;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get size() {
        return this._size;
    }

    set size(size) {
        this._size = size;
    }
}

class User {
    constructor(id, name, file, playState) {
        if (!id)
            throw new Error('Required argument "id" is not defined!');
        if (!name)
            throw new Error('Required argument "name" is not defined!');
        if (!(file instanceof File))
            throw new Error('Required argument "file" is not a "File" class instance!');
        if (!(playState instanceof PlayState))
            throw new Error('Required argument "playState" is not a "PlayState" class instance!');

        this._id = id;
        this._name = name;
        this._file = file;
        this._playState = playState;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get file() {
        return this._file;
    }

    get playState() {
        return this._playState;
    }
}

module.exports = {
    Room, PlayState, File, User
};
