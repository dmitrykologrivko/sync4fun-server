const {assert, expect} = require('chai');

const {Room} = require('../models');

const {PLAY_STATE_PLAYING, PLAY_STATE_PAUSE} = require('../constants').playStates;

const {UsersFactory} = require('./factories');

describe('Room model test', () => {
    let room;
    let users;
    let user = UsersFactory.makeUser(1, 'John');

    beforeEach(() => {
        room = new Room('Test');

        users = new Map();
        users.set(user.id, user);
    });

    describe('#constructor()', () => {
        it('should set default values', () => {
            assert.instanceOf(room.users, Map);
            assert.equal(room.playState, PLAY_STATE_PAUSE);
            assert.equal(room.currentTime, 0);
            assert.deepEqual(room.updatedBy, {});
            expect(room.updatedAt).to.satisfy(Number.isInteger);
        });
    });

    describe('#addUser()', () => {
        it('when argument user is not defined should throw error', () => {
            expect(() => (room.addUser()))
                .to
                .throw('Required argument "user" is not a "User" class instance!');
        });

        it('when argument user is not instance of User class should throw error', () => {
            expect(() => (room.addUser(new Error())))
                .to
                .throw('Required argument "user" is not a "User" class instance!');
        });

        it('when argument user is instance of User class should add to users list', () => {
            assert.equal(room.users.size, 0);

            room.addUser(user);

            assert.equal(room.users.size, 1);
            assert.deepEqual(room.users.get(user.id), user);
        });
    });

    describe('#removeUser()', () => {
        it('when argument user is not defined should throw error', () => {
            expect(() => (room.removeUser()))
                .to
                .throw('Required argument "user" is not a "User" class instance!');
        });

        it('when argument user is not instance of User class should throw error', () => {
            expect(() => (room.removeUser(new Error())))
                .to
                .throw('Required argument "user" is not a "User" class instance!');
        });

        it('when argument user is instance of User class should remove from users list', () => {
            room.users = users;

            room.removeUser(user);

            assert.equal(room.users.size, 0);
        });
    });

    describe('#updatePlayState()', () => {
        it('when argument playState is not defined should throw error', () => {
            expect(() => (room.updatePlayState(undefined)))
                .to
                .throw('Required argument "playState" is not one of play states!');
        });

        it('when argument playState is not one of play states should throw error', () => {
            expect(() => (room.updatePlayState('TEST')))
                .to
                .throw('Required argument "playState" is not one of play states!');
        });

        it('when argument currentTime is not defined should throw error', () => {
            expect(() => (room.updatePlayState(PLAY_STATE_PAUSE, undefined)))
                .to
                .throw('Required argument "currentTime" is not a number!');
        });

        it('when argument currentTime is not number should throw error', () => {
            expect(() => (room.updatePlayState(PLAY_STATE_PAUSE, '12345')))
                .to
                .throw('Required argument "currentTime" is not a number!');
        });

        it('when argument user is not defined should throw error', () => {
            expect(() => (room.updatePlayState(PLAY_STATE_PAUSE, 12345, undefined)))
                .to
                .throw('Required argument "user" is not a "User" class instance!');
        });

        it('when argument user is not instance of User class should throw error', () => {
            expect(() => (room.updatePlayState(PLAY_STATE_PAUSE, 12345, new Map())))
                .to
                .throw('Required argument "user" is not a "User" class instance!');
        });

        it('when argument user is not in room should throw error', () => {
            const user = UsersFactory.makeUser('ID:2', 'Kate');

            expect(() => (room.updatePlayState(PLAY_STATE_PAUSE, 12345, user)))
                .to
                .throw('Required argument "user" is not in this room!');
        });

        it('when arguments are valid should update pause state', () => {
            room.users = users;

            room.updatePlayState(PLAY_STATE_PAUSE, 12345, user);

            assert.equal(room.playState, PLAY_STATE_PAUSE);
            assert.equal(room.currentTime, 12345);
            assert.deepEqual(room.updatedBy, {id: user.id, name: user.name});
            expect(room.updatedAt).to.satisfy(Number.isInteger);
        });
    });

    describe('#isEmpty()', () => {
        it('when users list is empty should return true', () => {
            assert.equal(room.isEmpty(), true);
        });

        it('when users list is not empty should return false', () => {
            room.users = users;
            assert.equal(room.isEmpty(), false);
        });
    });

    describe('#setUsers()', () => {
        it('when argument users is not defined should throw error', () => {
            expect(() => (room.users = undefined))
                .to
                .throw('Required argument "users" is not a "Map" class instance!');
        });

        it('when argument user is not instance of Map class should throw error', () => {
            expect(() => (room.users = new Error()))
                .to
                .throw('Required argument "users" is not a "Map" class instance!');
        });

        it('when users list contains item not of User class instance should throw error', () => {
            users.set(2, {});

            expect(() => (room.users = users))
                .to
                .throw('Item with key "2" is not a "User" class instance!');
        });

        it('when argument users is instance of Map class should set users list', () => {
            room.users = users;
            assert.equal(room.users.size, 1);
        });
    });

    describe('#getCurrentTime()', () => {
        it('when current play state is playing should return calculated time', done => {
            const TIMEOUT = 100;

            room.users = users;

            assert.equal(room.currentTime, 0);
            assert.equal(room.playState, PLAY_STATE_PAUSE);

            room.updatePlayState(PLAY_STATE_PLAYING, 0, user);

            assert.equal(room.playState, PLAY_STATE_PLAYING);

            setTimeout(() => {
                assert.isAtLeast(room.currentTime, TIMEOUT / 1000);
                done();
            }, TIMEOUT);
        });
    });
});
