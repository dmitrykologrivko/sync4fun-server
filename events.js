const validate = require("validate.js");

const {Watcher, File} = require('./models');
const {
    WatcherUseThisRoomError,
    WatcherUseAnotherRoomError
} = require('./managers');

const {
    CONNECTION,
    DISCONNECT,
    JOIN_USER_TO_ROOM,
    YOU_JOINED_ROOM,
    USER_JOINED_ROOM,
    YOU_RECONNECTED_TO_ROOM,
    USER_RECONNECTED_TO_ROOM,
    ERROR_OF_JOINING_USER_TO_ROOM,
    LEAVE_USER_FROM_ROOM,
    YOU_LEFT_ROOM,
    USER_LEFT_ROOM,
    ERROR_OF_LEAVING_USER_FROM_ROOM,
    CHANGE_PLAY_STATE_TO_PLAY,
    CHANGED_PLAY_STATE_TO_PLAY,
    ERROR_OF_CHANGING_PLAY_STATE_TO_PLAY,
    CHANGE_PLAY_STATE_TO_PAUSE,
    CHANGED_PLAY_STATE_TO_PAUSE,
    ERROR_OF_CHANGING_PLAY_STATE_TO_PAUSE,
    CHANGE_PLAY_STATE_TO_STOP,
    CHANGED_PLAY_STATE_TO_STOP,
    ERROR_OF_CHANGING_PLAY_STATE_TO_STOP,
} = require('./constants').events;

async function joinUserToRoom(req, socket, roomManager) {
    const constraints = {
        'user': {
            presence: true,
            type: "object"
        },
        'user.name': {
            presence: true,
            type: "string"
        },
        'user.file': {
            presence: true,
            type: "object"
        },
        'user.file.name': {
            presence: true,
            type: "string"
        },
        'user.file.size': {
            presence: true,
            type: "number"
        },
        'room': {
            presence: true,
            type: "object"
        },
        'room.name': {
            presence: true,
            type: "string"
        }
    };

    try {
        await validate.async(req, constraints);
    } catch (error) {
        return socket.emit(ERROR_OF_JOINING_USER_TO_ROOM, {
            message: 'Validation error',
            fields: error
        });
    }

    let file = new File(req.user.file.name, req.user.file.size);
    let watcher = new Watcher(socket.id, req.user.name, file);

    try {
        roomManager.addWatcher(watcher, req.room.name);

        socket.join(req.room.name);

        socket.emit(YOU_JOINED_ROOM, {
            user: {
                id: watcher.getId(),
                name: watcher.getName(),
                file: {
                    name: file.name,
                    size: file.size
                }
            },
            room: {
                name: req.room.name
            }
        });

        return socket.to(req.room.name).emit(USER_JOINED_ROOM, {
            user: {
                id: watcher.getId(),
                name: watcher.getName()
            },
        });
    } catch (error) {
        if (error instanceof WatcherUseThisRoomError) {
            socket.emit(YOU_RECONNECTED_TO_ROOM, {
                user: {
                    id: watcher.getId(),
                    name: watcher.getName(),
                    file: {
                        name: file.name,
                        size: file.size
                    }
                },
                room: {
                    name: req.room.name
                }
            });

            socket.join(req.room.name);

            return socket.to(req.room.name).emit(USER_RECONNECTED_TO_ROOM, {
                user: {
                    id: watcher.getId(),
                    name: watcher.getName()
                },
            });
        }
        if (error instanceof WatcherUseAnotherRoomError) {
            let previousRoom = roomManager.findWatcherRoom(watcher);

            roomManager.moveWatcher(watcher, req.room.name);

            socket.leave(previousRoom.getName());

            socket.to(previousRoom.getName()).emit(USER_LEFT_ROOM, {
                user: {
                    id: watcher.getId(),
                    name: watcher.getName()
                }
            });

            socket.join(req.room.name);

            socket.emit(YOU_JOINED_ROOM, {
                user: {
                    id: watcher.getId(),
                    name: watcher.getName(),
                    file: {
                        name: file.name,
                        size: file.size
                    }
                },
                room: {
                    name: req.room.name
                }
            });

            return socket.to(req.room.name).emit(USER_JOINED_ROOM, {
                user: {
                    id: watcher.getId(),
                    name: watcher.getName()
                }
            });
        }

        return socket.emit(ERROR_OF_JOINING_USER_TO_ROOM, {message: 'Internal server error'});
    }
}

function leaveUserFromRoom(req, socket, roomManager) {
    let watcher = roomManager.findWatcherById(socket.id);
    if (!watcher) {
        return socket.emit(ERROR_OF_LEAVING_USER_FROM_ROOM, {message: 'You are not in any of the rooms'});
    }

    let room = roomManager.findWatcherRoom(watcher);

    roomManager.removeWatcher(watcher);

    socket.leave(room.getName());

    socket.emit(YOU_LEFT_ROOM, {});

    return socket.to(room.getName()).emit(USER_LEFT_ROOM, {
        user: {
            id: watcher.getId(),
            name: watcher.getName()
        }
    });
}

function changePlayStateToPlay(req, socket, roomManager) {
    let watcher = roomManager.findWatcherById(socket.id);
    if (!watcher) {
        return socket.emit(ERROR_OF_CHANGING_PLAY_STATE_TO_PLAY, {message: 'You are not in any of the rooms'});
    }

    let room = roomManager.findWatcherRoom(watcher);

    return socket.to(room.getName()).emit(CHANGED_PLAY_STATE_TO_PLAY, {
        user: {
            id: watcher.getId(),
            name: watcher.getName()
        }
    });
}

function changePlayStateToPause(req, socket, roomManager) {
    let watcher = roomManager.findWatcherById(socket.id);
    if (!watcher) {
        return socket.emit(ERROR_OF_CHANGING_PLAY_STATE_TO_PAUSE, {message: 'You are not in any of the rooms'});
    }

    let room = roomManager.findWatcherRoom(watcher);

    return socket.to(room.getName()).emit(CHANGED_PLAY_STATE_TO_PAUSE, {
        user: {
            id: watcher.getId(),
            name: watcher.getName()
        }
    });
}

function changePlayStateToStop(req, socket, roomManager) {
    let watcher = roomManager.findWatcherById(socket.id);
    if (!watcher) {
        return socket.emit(ERROR_OF_CHANGING_PLAY_STATE_TO_STOP, {message: 'You are not in any of the rooms'});
    }

    let room = roomManager.findWatcherRoom(watcher);

    return socket.to(room.getName()).emit(CHANGED_PLAY_STATE_TO_STOP, {
        user: {
            id: watcher.getId(),
            name: watcher.getName()
        }
    });
}

function disconnect(socket, roomManager) {
    let watcher = roomManager.findWatcherById(socket.id);
    if (!watcher) {
        return;
    }

    let room = roomManager.findWatcherRoom(watcher);

    roomManager.removeWatcher(watcher);

    socket.leave(room.getName());

    return socket.to(room.getName()).emit(USER_LEFT_ROOM, {
        user: {
            id: watcher.getId(),
            name: watcher.getName()
        }
    });
}

module.exports = (io, roomManager) => {
    io.on(CONNECTION, (socket) => {
        socket.on(JOIN_USER_TO_ROOM, req => (joinUserToRoom(req, socket, roomManager)));
        socket.on(LEAVE_USER_FROM_ROOM, req => (leaveUserFromRoom(req, socket, roomManager)));
        socket.on(CHANGE_PLAY_STATE_TO_PLAY, req => (changePlayStateToPlay(req, socket, roomManager)));
        socket.on(CHANGE_PLAY_STATE_TO_PAUSE, req => (changePlayStateToPause(req, socket, roomManager)));
        socket.on(CHANGE_PLAY_STATE_TO_STOP, req => (changePlayStateToStop(req, socket, roomManager)));
        socket.on(DISCONNECT, () => (disconnect(socket, roomManager)));
    });
};