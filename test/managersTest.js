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

        it('when user is not in any rooms should not remove any users', () => {
            const user = UsersFactory.makeUser('123', 'Some name');

            roomManager.removeUser(user);

            assert.equal(roomManager.rooms.size, 2);

            const room1 = roomManager.rooms.get('#1');
            const room2 = roomManager.rooms.get('#2');

            assert.equal(room1.users.size, 2);
            assert.equal(room2.users.size, 0);
        });
    });

    describe('#moveUser()', () => {
        it('when user is in another room and provided room exists should move user', () => {
            const room1 = roomManager.rooms.get('#1');
            const room2 = roomManager.rooms.get('#2');
            const user = room1.users.get('ID:1');

            assert.equal(roomManager.rooms.size, 2);
            assert.equal(room1.users.size, 2);
            assert.equal(room2.users.size, 0);

            roomManager.moveUser(user, room2.name);

            assert.equal(roomManager.rooms.size, 2);
            assert.equal(room1.users.size, 1);
            assert.equal(room2.users.size, 1);
            assert.equal(room2.users.has(user.id), true);
        });

        it('when user is in another room and provided room not exist should add room and move user', () => {
            const room1 = roomManager.rooms.get('#1');
            const room2 = roomManager.rooms.get('#2');
            const user = room1.users.get('ID:1');

            assert.equal(roomManager.rooms.size, 2);
            assert.equal(room1.users.size, 2);
            assert.equal(room2.users.size, 0);

            roomManager.moveUser(user, '#3');

            assert.equal(roomManager.rooms.size, 3);
            assert.equal(room1.users.size, 1);
            assert.equal(room2.users.size, 0);

            const room3 = roomManager.rooms.get('#3');

            assert.equal(room3.users.size, 1);
            assert.equal(room3.users.has(user.id), true);
        });

        it('when user is not in any rooms should not move any users', () => {
            const user = UsersFactory.makeUser('123', 'Some name');

            roomManager.moveUser(user, '#3');

            assert.equal(roomManager.rooms.size, 2);

            const room1 = roomManager.rooms.get('#1');
            const room2 = roomManager.rooms.get('#2');

            assert.equal(room1.users.size, 2);
            assert.equal(room2.users.size, 0);
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

    describe('#setRooms()', () => {
        it('when argument rooms is not defined should throw error', () => {
            expect(() => (roomManager.rooms = undefined))
                .to
                .throw('Required argument "rooms" is not a "Map" class instance!');
        });

        it('when argument rooms is not instance of Map class should throw error', () => {
            expect(() => (roomManager.rooms = new Error()))
                .to
                .throw('Required argument "rooms" is not a "Map" class instance!');
        });

        it('when rooms list contains item not of Room class instance should throw error', () => {
            const rooms = roomManager.rooms;
            rooms.set('#3', {});

            expect(() => (roomManager.rooms = rooms))
                .to
                .throw('Item with key "#3" is not a "Room" class instance!');
        });

        it('when argument rooms is instance of Map class should set rooms list', () => {
            roomManager.rooms = RoomsFactory.makeRooms(2);
            assert.equal(roomManager.rooms.size, 2);
        });
    });
});