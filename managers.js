const {Room, User} = require('./models');

class UserInThisRoomError extends Error {
}

class UserInAnotherRoomError extends Error {
}

class RoomManager {
    constructor() {
        this._rooms = new Map();
    }

    get rooms() {
        return this._rooms;
    }

    set rooms(rooms) {
        if (!rooms || !(rooms instanceof Map))
            throw new Error('Required argument "rooms" is not a "Map" class instance!');

        for (const [key, value] of rooms) {
            if (!(value instanceof Room)) {
                throw new Error(`Item with key "${key}" is not a "Room" class instance!`);
            }
        }

        this._rooms = rooms;
    }

    addUser(user, roomName) {
        const room = this.findRoomByUser(user);

        if (room) {
            if (room.name === roomName)
                throw new UserInThisRoomError();
            else
                throw new UserInAnotherRoomError();
        }

        if (this._rooms.has(roomName)) {
            this._rooms.get(roomName).addUser(user);
        } else {
            this._rooms.set(roomName, new Room(roomName));
            this._rooms.get(roomName).addUser(user);
        }

        return this._rooms.get(roomName);
    }

    removeUser(user) {
        const room = this.findRoomByUser(user);
        if (room) room.removeUser(user);
    }

    moveUser(user, roomName) {
        const room = this.findRoomByUser(user);

        if (!room) {
            return null;
        }

        room.removeUser(user);

        if (this._rooms.has(roomName)) {
            this._rooms.get(roomName).addUser(user);
        } else {
            this._rooms.set(roomName, new Room(roomName));
            this._rooms.get(roomName).addUser(user);
        }

        return this._rooms.get(roomName);
    }

    findRoomByUser(user) {
        for (const room of this._rooms.values()) {
            for (const [key, value] of room.users) {
                if (key === user.id) {
                    return room;
                }
            }
        }

        return null;
    }

    findUserById(userId) {
        if (!userId) return null;

        for (const room of this._rooms.values()) {
            for (const [key, value] of room.users) {
                if (key === userId) {
                    return value;
                }
            }
        }

        return null;
    }
}

module.exports = {
    RoomManager,
    UserInThisRoomError,
    UserInAnotherRoomError
};