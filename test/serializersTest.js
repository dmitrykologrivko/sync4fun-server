const {assert, expect} = require('chai');

const {
    UserSerializer,
    UserShortSerializer,
    RoomSerializer
} = require('./../serializers');

const {UsersFactory, RoomsFactory} = require('./factories');

describe('UserSerializer test', () => {
    const user = UsersFactory.makeUser(1, 'John');
    const serializer = new UserSerializer();

    describe('#serialize()', () => {
        it('when user argument is not instance of User class should throw error', done => {
            serializer.serialize({})
                .then(value => {
                    throw new Error('Was not supposed to succeed');
                })
                .catch(error => {
                    assert.equal(error.message, 'Provided argument is not instance of User class');
                    done();
                });
        });

        it('when user argument is instance of User class should serialize user', done => {
            const serializedUser = {
                id: user.id,
                name: user.name,
                file: {
                    name: user.file.name,
                    size: user.file.size
                }
            };

            serializer.serialize(user)
                .then(value => {
                    assert.deepEqual(value, serializedUser);
                    done();
                })
                .catch(error => {
                    throw Error('Was not supposed to fail');
                });
        });
    })
});

describe('UserShortSerializer test', () => {
    const user = UsersFactory.makeUser(1, 'John');
    const serializer = new UserShortSerializer();

    describe('#serialize()', () => {
        it('when user argument is not instance of User class should throw error', done => {
            serializer.serialize({})
                .then(value => {
                    throw new Error('Was not supposed to succeed');
                })
                .catch(error => {
                    assert.equal(error.message, 'Provided argument is not instance of User class');
                    done();
                });
        });

        it('when user argument is instance of User class should serialize user', done => {
            const serializedUser = {
                id: user.id,
                name: user.name
            };

            serializer.serialize(user)
                .then(value => {
                    assert.deepEqual(value, serializedUser);
                    done();
                })
                .catch(error => {
                    throw Error('Was not supposed to fail');
                });
        });
    })
});

describe('RoomSerializer test', () => {
    const room = RoomsFactory.makeRoom('#1');
    const user1 = UsersFactory.makeUser(1, 'John');
    const user2 = UsersFactory.makeUser(2, 'Kate');
    const serializer = new RoomSerializer();

    room.addUser(user1);
    room.addUser(user2);

    describe('#serialize()', () => {
        it('when room argument is not instance of Room class should throw error', done => {
            serializer.serialize({})
                .then(value => {
                    throw new Error('Was not supposed to succeed');
                })
                .catch(error => {
                    assert.equal(error.message, 'Provided argument is not instance of Room class');
                    done();
                });
        });

        it('when room argument is instance of Room class should serialize room', done => {
            const serializedRoom = {
                name: room.name,
                users: [
                    {
                        id: user1.id,
                        name: user1.name,
                        file: {
                            name: user1.file.name,
                            size: user1.file.size
                        }
                    },
                    {
                        id: user2.id,
                        name: user2.name,
                        file: {
                            name: user2.file.name,
                            size: user2.file.size
                        }
                    }
                ]
            };

            serializer.serialize(room)
                .then(value => {
                    assert.deepEqual(value, serializedRoom);
                    done();
                })
                .catch(error => {
                    throw Error('Was not supposed to fail');
                });
        });
    })
});