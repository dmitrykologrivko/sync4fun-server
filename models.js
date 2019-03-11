const {
    PLAY_STATE_PLAYING,
    PLAY_STATE_PAUSE,
    PLAY_STATE_STOP
} = require('./constants').playStates;

class Room {
    constructor(name, users = new Map()) {
        this._checkUsers(users);

        this._name = name;
        this._users = users;
        this._playState = PLAY_STATE_PAUSE;
        this._currentTime = 0;
        this._updatedAt = new Date().getTime();
        this._updatedBy = {};
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

    get playState() {
        return this._playState;
    }

    get currentTime() {
        if (this._playState === PLAY_STATE_PLAYING) {
            const now = new Date().getTime();
            const difference = (now - this._updatedAt) / 1000;
            return this._currentTime + difference;
        }

        return this._currentTime;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    get updatedBy() {
        return this._updatedBy;
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

    updatePlayState(playState, currentTime, user) {
        if (![PLAY_STATE_PLAYING, PLAY_STATE_PAUSE, PLAY_STATE_STOP].includes(playState))
            throw new Error('Required argument "playState" is not one of play states!');

        if (typeof currentTime !== 'number')
            throw new Error('Required argument "currentTime" is not a number!');

        if (!(user instanceof User))
            throw new Error('Required argument "user" is not a "User" class instance!');

        if (!this._users.has(user.id))
            throw new Error('Required argument "user" is not in this room!');

        this._playState = playState;
        this._currentTime = currentTime;
        this._updatedAt = new Date().getTime();
        this._updatedBy = {
            id: user.id,
            name: user.name
        };
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
    constructor(id, name, file) {
        if (!id)
            throw new Error('Required argument "id" is not defined!');

        if (!name)
            throw new Error('Required argument "name" is not defined!');

        if (!(file instanceof File))
            throw new Error('Required argument "file" is not a "File" class instance!');

        this._id = id;
        this._name = name;
        this._file = file;
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
}

module.exports = {
    Room, File, User
};