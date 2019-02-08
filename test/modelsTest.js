const {assert, expect} = require('chai');

const {Room} = require('../models');

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

    describe('#isEmpty()', () => {
        it('when users list is empty should return true', () => {
            assert.equal(room.isEmpty(), true);
        });

        it('when users list is not empty should return false', () => {
            room.users = users;
            assert.equal(room.isEmpty(), false);
        });
    });
});