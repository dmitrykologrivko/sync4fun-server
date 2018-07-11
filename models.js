class Room {
    constructor(name) {
        this._name = name;
        this._watchers = new Map();
    }

    getName() {
        return this._name;
    }

    getWatchers() {
        return this._watchers;
    }

    setWatchers(watchers) {
        this._watchers = watchers;
    }

    addWatcher(watcher) {
        this._watchers.set(watcher.getId(), watcher);
    }

    removeWatcher(watcher) {
        this._watchers.delete(watcher.getId());
    }

    isEmpty() {
        return this._watchers.size === 0;
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

class Watcher {
    constructor(id, name, file) {
        if (!id) throw new Error('Required param "ID" is missed!');
        if (!name) throw new Error('Required param "Name" is missed!');
        // TODO: File is required param

        this._id = id;
        this._name = name;
        this._file = file;
    }

    getId() {
        return this._id;
    }

    getName() {
        return this._name;
    }

    getFile() {
        return this._file;
    }

    setFile(file) {
        this._file = file;
    }
}

module.exports = {
    Room, File, Watcher
};