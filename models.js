class Room {
    constructor(name) {
        this._name = name;
        this._users = new Map();
    }

    get name() {
        return this._name;
    }

    get users() {
        return this._users;
    }

    set users(users) {
        if (!users || !(users instanceof Map))
            throw new Error('Required argument "users" is not a "Map" class instance!');

        for (const [key, value] of users) {
            if (!(value instanceof User)) {
                throw new Error(`Item with key "${key}" is not a "User" class instance!`);
            }
        }

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