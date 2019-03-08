const {User, Room} = require('./models');

class BaseSerializer {
    _checkInstanceOf(instance, clazz, argumentName = 'Provided argument') {
        if (!(instance instanceof clazz)) {
            throw new Error(`${argumentName} is not instance of ${clazz.name} class`);
        }
    }

    async serialize(data) {
        throw new Error('Serialize method is not implemented!');
    }
}

class UserSerializer extends BaseSerializer {
    async serialize(user) {
        return new Promise(((resolve, reject) => {
            this._checkInstanceOf(user, User);

            return resolve({
                id: user.id,
                name: user.name,
                file: {
                    name: user.file.name,
                    size: user.file.size
                }
            });
        }));
    }
}

class UserShortSerializer extends BaseSerializer {
    async serialize(user) {
        return new Promise(((resolve, reject) => {
            this._checkInstanceOf(user, User);

            return resolve({
                id: user.id,
                name: user.name
            });
        }));
    }
}

class RoomSerializer extends BaseSerializer {
    async serialize(room) {
        return new Promise(((resolve, reject) => {
            this._checkInstanceOf(room, Room);

            return resolve({
                name: room.name,
                playState: room.playState,
                currentTime: room.currentTime,
                updatedAt: room.updatedAt,
                updatedBy: room.updatedBy,
                users: Array.from(room.users.values()).map(user => ({
                    id: user.id,
                    name: user.name,
                    file: {
                        name: user.file.name,
                        size: user.file.size
                    }
                }))
            });
        }));
    }
}

module.exports = {
    UserSerializer, UserShortSerializer, RoomSerializer
};
