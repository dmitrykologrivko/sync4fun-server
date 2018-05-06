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

class Watcher {
    constructor(id, name) {
        this._id = id;
        this._name = name;
        this._file = null;
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

module.exports.Room = Room;
module.exports.Watcher = Watcher;