const {assert, expect} = require('chai');

const {RoomManager} = require('../managers');

const {
    CONNECT,
    JOIN_USER_TO_ROOM,
    YOU_JOINED_ROOM,
    USER_JOINED_ROOM,
    YOU_RECONNECTED_TO_ROOM,
    USER_RECONNECTED_TO_ROOM,
    ERROR_OF_JOINING_USER_TO_ROOM,
    LEAVE_USER_FROM_ROOM,
    ERROR_OF_LEAVING_USER_FROM_ROOM,
    YOU_LEFT_ROOM,
    USER_LEFT_ROOM,
    CHANGE_PLAY_STATE,
    CHANGED_PLAY_STATE,
    ERROR_OF_CHANGING_PLAY_STATE
} = require('../constants').events;

const {
    PLAY_STATE_PLAYING,
    PLAY_STATE_PAUSE,
    PLAY_STATE_STOP
} = require('../constants').playStates;

describe('Events test', () => {
    let httpServer;
    let httpServerAddr;
    let socketServer;
    let socketClient1;
    let socketClient2;
    let socketClient3;
    let roomManager;

    function assertEqualUser(actUser, expUser) {
        assert.isDefined(actUser.id);
        assert.equal(actUser.name, expUser.name);
        assert.equal(actUser.file.name, expUser.file.name);
        assert.equal(actUser.file.size, expUser.file.size);
    }

    function assertEqualUserShort(actUser, expUser) {
        assert.equal(Object.keys(actUser).length, 2);

        assert.isDefined(actUser.id);
        assert.equal(actUser.name, expUser.name);
    }

    function assertEqualRoom(actRoom, expRoom) {
        assert.equal(actRoom.name, expRoom.name);
        assert.equal(actRoom.playState, expRoom.playState);
        assert.isAtLeast(actRoom.currentTime, expRoom.currentTime);
        assert.isAtLeast(actRoom.updatedAt, expRoom.updatedAt);

        if (Object.entries(expRoom.updatedBy).length === 0) {
            assert.deepEqual(actRoom.updatedBy, expRoom.updatedBy);
        } else {
            assert.isDefined(actRoom.updatedBy.id);
            assert.equal(actRoom.updatedBy.name, expRoom.updatedBy.name);
        }

        for (let i = 0; i < actRoom.users.length; i++) {
            const actUser = actRoom.users[i];
            const expUser = expRoom.users[i];

            assert.equal(actUser.name, expUser.name);
            assert.equal(actUser.file.name, expUser.file.name);
            assert.equal(actUser.file.size, expUser.file.size);
        }
    }

    function assertEqualPlayState(actPlayState, expPlayState) {
        assert.equal(actPlayState.playState, expPlayState.playState);
        assert.isAtLeast(actPlayState.currentTime, expPlayState.currentTime);
        assert.isDefined(actPlayState.updatedBy.id);
        assert.equal(actPlayState.updatedBy.name, expPlayState.updatedBy.name);
        assert.equal(actPlayState.seek, expPlayState.seek);
    }

    before(done => {
        httpServer = require('http').createServer().listen(() => {
            httpServerAddr = httpServer.address();
            socketServer = require('socket.io')(httpServer);
            roomManager = new RoomManager();
            require('../events')(socketServer, roomManager);

            done();
        });
    });

    after(done => {
        socketServer.close();
        httpServer.close();
        done();
    });

    beforeEach(done => {
        const socketURL = `http://[${httpServerAddr.address}]:${httpServerAddr.port}`;
        const socketConfig = {
            'reconnect': false,
            'reconnection delay': 0,
            'reopen delay': 0,
            'force new connection': true,
            transports: ['websocket'],
        };

        socketClient1 = require('socket.io-client').connect(socketURL, socketConfig);

        socketClient1.on(CONNECT, () => {
            socketClient2 = require('socket.io-client').connect(socketURL, socketConfig);

            socketClient2.on(CONNECT, () => {
                socketClient3 = require('socket.io-client').connect(socketURL, socketConfig);

                socketClient3.on(CONNECT, () => {
                    done();
                });
            });
        });
    });

    afterEach(done => {
        if (socketClient1.connected) {
            socketClient1.disconnect();
        }
        if (socketClient2.connected) {
            socketClient2.disconnect();
        }
        if (socketClient3.connected) {
            socketClient3.disconnect();
        }

        // Clear rooms after each test
        roomManager.rooms = new Map();

        done();
    });

    describe(`test requesting ${JOIN_USER_TO_ROOM} event`, () => {
        it('when request is empty', done => {
            socketClient1.once(ERROR_OF_JOINING_USER_TO_ROOM, res => {
                const errorResponse = {
                    message: 'Validation error',
                    fields: {
                        'room': [
                            "Room can't be blank"
                        ],
                        'room.name': [
                            "Room name can't be blank"
                        ],
                        'user': [
                            "User can't be blank"
                        ],
                        'user.file': [
                            "User file can't be blank"
                        ],
                        'user.file.name': [
                            "User file name can't be blank"
                        ],
                        'user.file.size': [
                            "User file size can't be blank"
                        ],
                        'user.name': [
                            "User name can't be blank"
                        ]
                    }
                };

                assert.deepEqual(res, errorResponse);

                done();
            });

            socketClient1.emit(JOIN_USER_TO_ROOM, {});
        });

        it('when request has no required fields', done => {
            socketClient1.once(ERROR_OF_JOINING_USER_TO_ROOM, res => {
                const errorResponse = {
                    message: 'Validation error',
                    fields: {
                        'room.name': [
                            "Room name can't be blank"
                        ],
                        'user.file': [
                            "User file can't be blank"
                        ],
                        'user.file.name': [
                            "User file name can't be blank"
                        ],
                        'user.file.size': [
                            "User file size can't be blank"
                        ],
                        'user.name': [
                            "User name can't be blank"
                        ]
                    }
                };

                assert.deepEqual(res, errorResponse);

                done();
            });

            socketClient1.emit(JOIN_USER_TO_ROOM, {
                user: {},
                room: {}
            });
        });

        it('when request has incorrect types of fields', done => {
            socketClient1.once(ERROR_OF_JOINING_USER_TO_ROOM, res => {
                const errorResponse = {
                    message: 'Validation error',
                    fields: {
                        'room.name': [
                            "Room name must be of type string",
                            "Room name has an incorrect length"
                        ],
                        'user.file.name': [
                            "User file name must be of type string",
                            "User file name has an incorrect length"
                        ],
                        'user.file.size': [
                            "User file size must be an integer"
                        ],
                        'user.name': [
                            "User name must be of type string",
                            "User name has an incorrect length"
                        ]
                    }
                };

                assert.deepEqual(res, errorResponse);

                done();
            });

            socketClient1.emit(JOIN_USER_TO_ROOM, {
                user: {
                    name: 1,
                    file: {
                        name: 1,
                        size: 1.1
                    }
                },
                room: {
                    name: 1
                }
            });
        });

        it('when request has fields values less than minimum length', done => {
            socketClient1.once(ERROR_OF_JOINING_USER_TO_ROOM, res => {
                const errorResponse = {
                    message: 'Validation error',
                    fields: {
                        'room.name': [
                            "Room name is too short (minimum is 2 characters)"
                        ],
                        'user.file.name': [
                            "User file name is too short (minimum is 3 characters)"
                        ],
                        'user.name': [
                            "User name is too short (minimum is 2 characters)"
                        ]
                    }
                };

                assert.deepEqual(res, errorResponse);

                done();
            });

            socketClient1.emit(JOIN_USER_TO_ROOM, {
                user: {
                    name: 'J',
                    file: {
                        name: 'r',
                        size: 1
                    }
                },
                room: {
                    name: 'M'
                }
            });
        });

        it('when request has fields values more than maximum length', done => {
            socketClient1.once(ERROR_OF_JOINING_USER_TO_ROOM, res => {
                const errorResponse = {
                    message: 'Validation error',
                    fields: {
                        'room.name': [
                            "Room name is too long (maximum is 20 characters)"
                        ],
                        'user.file.name': [
                            "User file name is too long (maximum is 100 characters)"
                        ],
                        'user.name': [
                            "User name is too long (maximum is 20 characters)"
                        ]
                    }
                };

                assert.deepEqual(res, errorResponse);

                done();
            });

            socketClient1.emit(JOIN_USER_TO_ROOM, {
                user: {
                    name: 'John-John-John-John-John-John',
                    file: {
                        name: 'rabbit-rabbit-rabbit-rabbit-rabbit-rabbit-rabbit-' +
                            'rabbit-rabbit-rabbit-rabbit-rabbit-rabbit-rabbit-rabbit.mp4',
                        size: 1
                    }
                },
                room: {
                    name: 'My room-My room-My room'
                }
            });
        });

        it('when new user tries to join the room', done => {
            const reqJoinUserToRoomClient1 = {
                user: {
                    name: 'John',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const reqJoinUserToRoomClient2 = {
                user: {
                    name: 'Kate',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const resYouJoinedRoomClient1 = {
                user: {
                    name: 'John',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room',
                    playState: PLAY_STATE_PAUSE,
                    currentTime: 0,
                    updatedAt: new Date().getTime(),
                    updatedBy: {},
                    users: [
                        {
                            name: 'John',
                            file: {
                                name: 'rabbit.mp4',
                                size: 145899989
                            }
                        }
                    ]
                }
            };

            const resYouJoinedRoomClient2 = {
                user: {
                    name: 'Kate',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room',
                    playState: PLAY_STATE_PAUSE,
                    currentTime: 0,
                    updatedAt: new Date().getTime(),
                    updatedBy: {},
                    users: [
                        {
                            name: 'John',
                            file: {
                                name: 'rabbit.mp4',
                                size: 145899989
                            }
                        },
                        {
                            name: 'Kate',
                            file: {
                                name: 'rabbit.mp4',
                                size: 145899989
                            }
                        }
                    ]
                }
            };

            const resUserJoinedRoomClient1 = {
                user: {
                    name: 'Kate',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                }
            };

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient1);

            // #2 - John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                assertEqualUser(res.user, resYouJoinedRoomClient1.user);
                assertEqualRoom(res.room, resYouJoinedRoomClient1.room);

                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    assertEqualUser(res.user, resYouJoinedRoomClient2.user);
                    assertEqualRoom(res.room, resYouJoinedRoomClient2.room);

                    // #5 - John got an event that Kate joined
                    socketClient1.once(USER_JOINED_ROOM, res => {
                        assertEqualUser(res.user, resUserJoinedRoomClient1.user);

                        done();
                    });
                });
            });
        });

        it('when user uses this room already and tries to join again', done => {
            const reqJoinUserToRoomClient1 = {
                user: {
                    name: 'John',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const reqJoinUserToRoomClient2 = {
                user: {
                    name: 'Kate',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const resYouReconnectedToRoomClient1 = {
                user: {
                    name: 'John',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room',
                    playState: PLAY_STATE_PAUSE,
                    currentTime: 0,
                    updatedAt: new Date().getTime(),
                    updatedBy: {},
                    users: [
                        {
                            name: 'John',
                            file: {
                                name: 'rabbit.mp4',
                                size: 145899989
                            }
                        },
                        {
                            name: 'Kate',
                            file: {
                                name: 'rabbit.mp4',
                                size: 145899989
                            }
                        }
                    ]
                }
            };

            const resUserReconnectedToRoomClient2 = {
                user: {
                    name: 'John',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                }
            };

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient1);

            // #2 - John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    // #5 - Try to reconnect John to "My room"
                    socketClient1.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient1);

                    // #6 - John reconnected to "My room"
                    socketClient1.once(YOU_RECONNECTED_TO_ROOM, res => {
                        assertEqualUser(res.user, resYouReconnectedToRoomClient1.user);
                        assertEqualRoom(res.room, resYouReconnectedToRoomClient1.room);

                        // #7 - Kate got an event that John reconnected
                        socketClient2.once(USER_RECONNECTED_TO_ROOM, res => {
                            assertEqualUser(res.user, resUserReconnectedToRoomClient2.user);

                            done();
                        });
                    });
                });
            });
        });

        it('when user uses another room but tries to join another one', done => {
            const reqJoinUserToRoomClient1 = {
                user: {
                    name: 'John',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const reqJoinUserToRoomClient2 = {
                user: {
                    name: 'Kate',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const reqJoinUserToRoomClient3 = {
                user: {
                    name: 'Bob',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room 2'
                }
            };

            const reqJoinUserToRoom2Client1 = {
                user: {
                    name: 'John',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room 2'
                }
            };

            const resYouJoinedRoomClient1 = {
                user: {
                    name: 'John',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room 2',
                    playState: PLAY_STATE_PAUSE,
                    currentTime: 0,
                    updatedAt: new Date().getTime(),
                    updatedBy: {},
                    users: [
                        {
                            name: 'Bob',
                            file: {
                                name: 'rabbit.mp4',
                                size: 145899989
                            }
                        },
                        {
                            name: 'John',
                            file: {
                                name: 'rabbit.mp4',
                                size: 145899989
                            }
                        }
                    ]
                }
            };

            const resUserLeftRoomClient2 = {
                user: {
                    name: 'John'
                }
            };

            const resUserJoinedRoomClient3 = {
                user: {
                    name: 'John',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                }
            };

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient1);

            // #2 -  John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    // #5 - Connect Bob to "My room 2"
                    socketClient3.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient3);

                    // #6 - Bob connected to "My room 2"
                    socketClient3.once(YOU_JOINED_ROOM, res => {
                        // #7 - Connect John to "My room 2"
                        socketClient1.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoom2Client1);

                        // #8 - Kate got an event that John came out from room
                        socketClient2.once(USER_LEFT_ROOM, res => {
                            assertEqualUserShort(res.user, resUserLeftRoomClient2.user);

                            // #9 - John connected to "My room 2"
                            socketClient1.once(YOU_JOINED_ROOM, res => {
                                assertEqualUser(res.user, resYouJoinedRoomClient1.user);
                                assertEqualRoom(res.room, resYouJoinedRoomClient1.room);

                                // #10 - Bob got an event that John joined
                                socketClient3.once(USER_JOINED_ROOM, res => {
                                    assertEqualUser(res.user, resUserJoinedRoomClient3.user);

                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    describe(`test requesting ${LEAVE_USER_FROM_ROOM} event`, () => {
        it('when user is trying to leave room', done => {
            const reqJoinUserToRoomClient1 = {
                user: {
                    name: 'John',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const reqJoinUserToRoomClient2 = {
                user: {
                    name: 'Kate',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const resUserLeftRoomClient2 = {
                user: {
                    name: 'John'
                }
            };

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient1);

            // #2 - John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    // #5 - Leave John from "My room"
                    socketClient1.emit(LEAVE_USER_FROM_ROOM, {});

                    // #6 - John left "My room"
                    socketClient1.once(YOU_LEFT_ROOM, res => {
                        expect(res).to.be.empty;

                        // #7 - Kate got an event that John is left room
                        socketClient2.once(USER_LEFT_ROOM, res => {
                            assertEqualUserShort(res.user, resUserLeftRoomClient2.user);

                            done();
                        });
                    });
                });
            });
        });

        it('when user is trying to leave the room but was not in it', done => {
            // #1 - Leave user from "My room"
            socketClient1.emit(LEAVE_USER_FROM_ROOM, {});

            // #2 - User got an error that he is not in one room
            socketClient1.once(ERROR_OF_LEAVING_USER_FROM_ROOM, res => {
                const errorResponse = {
                    message: 'You are not in any of the rooms'
                };

                assert.deepEqual(res, errorResponse);

                done();
            });
        });
    });

    describe(`test requesting ${CHANGE_PLAY_STATE} event`, () => {
        it('when request is empty', done => {
            socketClient1.once(ERROR_OF_CHANGING_PLAY_STATE, res => {
                const errorResponse = {
                    message: 'Validation error',
                    fields: {
                        'currentTime': [
                            "Current time can't be blank"
                        ],
                        'playState': [
                            "Play state can't be blank"
                        ]
                    }
                };

                assert.deepEqual(res, errorResponse);

                done();
            });

            socketClient1.emit(CHANGE_PLAY_STATE, {});
        });

        it('when request has no required fields', done => {
            socketClient1.once(ERROR_OF_CHANGING_PLAY_STATE, res => {
                const errorResponse = {
                    message: 'Validation error',
                    fields: {
                        'currentTime': [
                            "Current time can't be blank"
                        ],
                        'playState': [
                            "Play state can't be blank"
                        ]
                    }
                };

                assert.deepEqual(res, errorResponse);

                done();
            });

            socketClient1.emit(CHANGE_PLAY_STATE, {seek: true});
        });

        it('when request has incorrect types of fields', done => {
            socketClient1.once(ERROR_OF_CHANGING_PLAY_STATE, res => {
                const errorResponse = {
                    message: 'Validation error',
                    fields: {
                        'currentTime': [
                            "Current time must be of type number"
                        ],
                        'playState': [
                            "Play state must be of type string",
                            "1 is not included in the list"
                        ],
                        'seek': [
                            "Seek must be of type boolean"
                        ]
                    }
                };

                assert.deepEqual(res, errorResponse);

                done();
            });

            socketClient1.emit(CHANGE_PLAY_STATE, {
                playState: 1,
                currentTime: '12345',
                seek: 'true'
            });
        });

        it('when request has invalid values', done => {
            socketClient1.once(ERROR_OF_CHANGING_PLAY_STATE, res => {
                const errorResponse = {
                    message: 'Validation error',
                    fields: {
                        'playState': [
                            "TEST is not included in the list"
                        ]
                    }
                };

                assert.deepEqual(res, errorResponse);

                done();
            });

            socketClient1.emit(CHANGE_PLAY_STATE, {
                playState: 'TEST',
                currentTime: 12345,
                seek: true
            });
        });

        it('when user in the room and is trying to change play state to playing', done => {
            const reqJoinUserToRoomClient1 = {
                user: {
                    name: 'John',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const reqJoinUserToRoomClient2 = {
                user: {
                    name: 'Kate',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const reqChangePlayStateClient1 = {
                playState: PLAY_STATE_PLAYING,
                currentTime: 207.141845,
                seek: false
            };

            const resChangedPlayStateClient2 = {
                playState: PLAY_STATE_PLAYING,
                currentTime: 207.141845,
                seek: false,
                updatedBy: {
                    name: 'John'
                }
            };

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient1);

            // #2 - John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    // #5 - Change play state to playing by John
                    socketClient1.emit(CHANGE_PLAY_STATE, reqChangePlayStateClient1);

                    // #6 - Kate got an event that John changed play state to playing
                    socketClient2.once(CHANGED_PLAY_STATE, res => {
                        assertEqualPlayState(res, resChangedPlayStateClient2);

                        done();
                    });
                });
            });
        });

        it('when user in the room and is trying to change play state to pause', done => {
            const reqJoinUserToRoomClient1 = {
                user: {
                    name: 'John',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const reqJoinUserToRoomClient2 = {
                user: {
                    name: 'Kate',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const reqChangePlayStateClient1 = {
                playState: PLAY_STATE_PAUSE,
                currentTime: 207.141845,
                seek: false
            };

            const resChangedPlayStateClient2 = {
                playState: PLAY_STATE_PAUSE,
                currentTime: 207.141845,
                seek: false,
                updatedBy: {
                    name: 'John'
                }
            };

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient1);

            // #2 - John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    // #5 - Change play state to pause by John
                    socketClient1.emit(CHANGE_PLAY_STATE, reqChangePlayStateClient1);

                    // #6 - Kate got an event that John changed play state to pause
                    socketClient2.once(CHANGED_PLAY_STATE, res => {
                        assertEqualPlayState(res, resChangedPlayStateClient2);

                        done();
                    });
                });
            });
        });

        it('when user in the room and is trying to change play state to stop', done => {
            const reqJoinUserToRoomClient1 = {
                user: {
                    name: 'John',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const reqJoinUserToRoomClient2 = {
                user: {
                    name: 'Kate',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const reqChangePlayStateClient1 = {
                playState: PLAY_STATE_STOP,
                currentTime: 207.141845,
                seek: false
            };

            const resChangedPlayStateClient2 = {
                playState: PLAY_STATE_STOP,
                currentTime: 207.141845,
                seek: false,
                updatedBy: {
                    name: 'John'
                }
            };

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient1);

            // #2 - John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    // #5 - Change play state to stop by John
                    socketClient1.emit(CHANGE_PLAY_STATE, reqChangePlayStateClient1);

                    // #6 - Kate got an event that John changed play state to stop
                    socketClient2.once(CHANGED_PLAY_STATE, res => {
                        assertEqualPlayState(res, resChangedPlayStateClient2);

                        done();
                    });
                });
            });
        });

        it('when user in the room and is trying to change current time', done => {
            const reqJoinUserToRoomClient1 = {
                user: {
                    name: 'John',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const reqJoinUserToRoomClient2 = {
                user: {
                    name: 'Kate',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const reqChangePlayStateClient1 = {
                playState: PLAY_STATE_PLAYING,
                currentTime: 207.141845,
                seek: true
            };

            const resChangedPlayStateClient2 = {
                playState: PLAY_STATE_PLAYING,
                currentTime: 207.141845,
                seek: true,
                updatedBy: {
                    name: 'John'
                }
            };

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient1);

            // #2 - John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    // #5 - Change current time by John
                    socketClient1.emit(CHANGE_PLAY_STATE, reqChangePlayStateClient1);

                    // #6 - Kate got an event that John changed current time
                    socketClient2.once(CHANGED_PLAY_STATE, res => {
                        assertEqualPlayState(res, resChangedPlayStateClient2);

                        done();
                    });
                });
            });
        });

        it('when user is trying to change play state but is not in any room', done => {
            // #1 - Change play state
            socketClient1.emit(CHANGE_PLAY_STATE, {
                playState: PLAY_STATE_PAUSE,
                currentTime: 12345,
                seek: true
            });

            // #2 - User got an error that he is not in one room
            socketClient1.once(ERROR_OF_CHANGING_PLAY_STATE, res => {
                const errorResponse = {
                    message: 'You are not in any of the rooms'
                };

                assert.deepEqual(res, errorResponse);

                done();
            });
        });
    });

    describe('test restoring play state', () => {
        it('when new user tries join the room', done => {
            const TIMEOUT = 500;

            const reqJoinUserToRoomClient1 = {
                user: {
                    name: 'John',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const reqJoinUserToRoomClient2 = {
                user: {
                    name: 'Kate',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const reqChangePlayStateClient1 = {
                playState: PLAY_STATE_PLAYING,
                currentTime: 0,
                seek: false
            };

            const resYouJoinedRoomClient2 = {
                user: {
                    name: 'Kate',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room',
                    playState: PLAY_STATE_PLAYING,
                    currentTime: TIMEOUT / 1000,
                    updatedAt: new Date().getTime(),
                    updatedBy: {
                        name: 'John'
                    },
                    users: [
                        {
                            name: 'John',
                            file: {
                                name: 'rabbit.mp4',
                                size: 145899989
                            }
                        },
                        {
                            name: 'Kate',
                            file: {
                                name: 'rabbit.mp4',
                                size: 145899989
                            }
                        }
                    ]
                }
            };

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient1);

            // #2 - John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                // #3 - Change play state to play by John
                socketClient1.emit(CHANGE_PLAY_STATE, reqChangePlayStateClient1);

                // #4 - Wait timeout 500ms
                setTimeout(() => {
                    // #5 - Connect Kate to "My room"
                    socketClient2.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient2);

                    // #6 - Kate connected to "My room"
                    socketClient2.once(YOU_JOINED_ROOM, res => {
                        assertEqualUser(res.user, resYouJoinedRoomClient2.user);
                        assertEqualRoom(res.room, resYouJoinedRoomClient2.room);

                        done();
                    });
                }, TIMEOUT);
            });
        });
    });

    describe('test disconnecting user', () => {
        it('when user was in any group', done => {
            const reqJoinUserToRoomClient1 = {
                user: {
                    name: 'John',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const reqJoinUserToRoomClient2 = {
                user: {
                    name: 'Kate',
                    file: {
                        name: 'rabbit.mp4',
                        size: 145899989
                    }
                },
                room: {
                    name: 'My room'
                }
            };

            const resChangedUserLeftRoomClient2 = {
                user: {
                    name: 'John'
                }
            };

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient1);

            // #2 - John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    // #5 - John disconnected
                    socketClient1.disconnect();

                    // #6 - Kate got an event that John came out from room
                    socketClient2.once(USER_LEFT_ROOM, res => {
                        assertEqualUserShort(res.user, resChangedUserLeftRoomClient2.user);

                        done();
                    });
                });
            });
        });
    });
});