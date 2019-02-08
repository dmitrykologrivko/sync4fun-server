const {assert, expect} = require('chai');

const {
    RoomManager,
    UserInThisRoomError,
    UserInAnotherRoomError
} = require('../managers');

const {RoomsFactory, UsersFactory} = require('./factories');

describe('Room manager test', () => {
    let roomManager;

    beforeEach(() => {
        const rooms = RoomsFactory.makeRooms(2);

        rooms.get('#1').users = UsersFactory.makeUsers(2);

        roomManager = new RoomManager();
        roomManager.rooms = rooms;
    });

    describe('#addUser()', () => {
        it('when user is in the provided room should throw error', () => {
            const room = roomManager.rooms.get('#1');
            const user = room.users.get('ID:1');

            expect(() => {roomManager.addUser(user, room.name)})
                .to
                .throw(UserInThisRoomError);
        });

        it('when user is in another room should throw error', () => {
            const room = roomManager.rooms.get('#2');
            const user = roomManager.rooms.get('#1').users.get('ID:1');

            expect(() => {roomManager.addUser(user, room.name)})
                .to
                .throw(UserInAnotherRoomError);
        });

        it('when user is not in any rooms and provided room exists should add user to existing room', () => {
            const room = roomManager.rooms.get('#2');
            const user = UsersFactory.makeUser('123', 'Some name');

            assert.equal(false, room.users.has(user.id));

            roomManager.addUser(user, room.name);

            assert.equal(true, room.users.has(user.id));
        });

        it('when user is not in any rooms and provided room not exist should add room and user', () => {
            let room = RoomsFactory.makeRoom('Some room');
            let user = UsersFactory.makeUser('123', 'Some name');

            assert.equal(false, roomManager.rooms.has(room.name));

            roomManager.addUser(user, room.name);

            assert.equal(true, roomManager.rooms.has(room.name));

            room = roomManager.rooms.get(room.name);

            assert.equal(true, room.users.has(user.id));
        });
    });

    describe('#removeUser()', () => {
        it('when user is in room should remove user', () => {
            const room = roomManager.rooms.get('#1');
            const user = room.users.get('ID:1');

            assert.equal(true, room.users.has(user.id));

            roomManager.removeUser(user);

            assert.equal(false, room.users.has(user.id));
        });

        it('when user is not in any rooms should not do any changes', () => {
            const user = UsersFactory.makeUser('123', 'Some name');
            // TODO: Improve checking?
            roomManager.removeUser(user);
        });
    });

    describe('#moveUser()', () => {
        it('when user is in another room and provided room exists should move user', () => {
            throw Error('Not implemented test');
        });

        it('when user is in another room and provided room not exist should add room and move user', () => {
            throw Error('Not implemented test');
        });

        it('when user is not in any rooms should not do any changes', () => {
            throw Error('Not implemented test');
        });
    });

    describe('#findRoomByUser()', () => {
        it('when user is in room should return room', () => {
            const room = roomManager.rooms.get('#1');
            const user = room.users.get('ID:1');

            assert.equal(room, roomManager.findRoomByUser(user));
        });

        it('when user in not in room should return null', () => {
            const user = UsersFactory.makeUser('123', 'Some name');
            assert.isNull(roomManager.findRoomByUser(user));
        });
    });

});