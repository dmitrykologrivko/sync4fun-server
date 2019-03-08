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
    CHANGE_PLAY_STATE_TIME,
    CHANGED_PLAY_STATE_TIME,
    ERROR_OF_CHANGING_PLAY_STATE_TIME
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
        assert.deepEqual(actRoom.updatedBy, expRoom.updatedBy);

        for (let i = 0; i < actRoom.users.length; i++) {
            const actUser = actRoom.users[i];
            const expUser = expRoom.users[i];

            assert.equal(actUser.name, expUser.name);
            assert.equal(actUser.file.name, expUser.file.name);
            assert.equal(actUser.file.size, expUser.file.size);
        }
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

    describe(`test requesting ${CHANGE_PLAY_STATE_TO_PLAY} event`, () => {
        it('when user in the room and is trying to set play state to play', done => {
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

            const resChangedPlayStateToPlayClient2 = {
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
                    // #5 - Change play state to play by John
                    socketClient1.emit(CHANGE_PLAY_STATE_TO_PLAY, {});

                    // #6 - Kate got an event that John changed play state to play
                    socketClient2.once(CHANGED_PLAY_STATE_TO_PLAY, res => {
                        assertEqualUserShort(res.user, resChangedPlayStateToPlayClient2.user);

                        done();
                    });
                });
            });
        });

        it('when user is trying to set play state to play but is not in any room', done => {
            // #1 - Change play state to play
            socketClient1.emit(CHANGE_PLAY_STATE_TO_PLAY, {});

            // #2 - User got an error that he is not in one room
            socketClient1.once(ERROR_OF_CHANGING_PLAY_STATE_TO_PLAY, res => {
                const errorResponse = {
                    message: 'You are not in any of the rooms'
                };

                assert.deepEqual(res, errorResponse);

                done();
            });
        });
    });

    describe(`test requesting ${CHANGE_PLAY_STATE_TO_PAUSE} event`, () => {
        it('when user in the room and is trying to set play state to pause', done => {
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

            const resChangedPlayStateToPauseClient2 = {
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
                    // #5 - Change play state to pause by John
                    socketClient1.emit(CHANGE_PLAY_STATE_TO_PAUSE, {});

                    // #6 - Kate got an event that John changed play state to play
                    socketClient2.once(CHANGED_PLAY_STATE_TO_PAUSE, res => {
                        assertEqualUserShort(res.user, resChangedPlayStateToPauseClient2.user);

                        done();
                    });
                });
            });
        });

        it('when user is trying to set play state to pause but is not in any room', done => {
            // #1 - Change play state to pause
            socketClient1.emit(CHANGE_PLAY_STATE_TO_PAUSE, {});

            // #2 - User got an error that he is not in one room
            socketClient1.once(ERROR_OF_CHANGING_PLAY_STATE_TO_PAUSE, res => {
                const errorResponse = {
                    message: 'You are not in any of the rooms'
                };

                assert.deepEqual(res, errorResponse);

                done();
            });
        });
    });

    describe(`test requesting ${CHANGE_PLAY_STATE_TO_STOP} event`, () => {
        it('when user in the room and is trying to set play state to stop', done => {
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

            const resChangedPlayStateToStopClient2 = {
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
                    // #5 - Change play state to stop by John
                    socketClient1.emit(CHANGE_PLAY_STATE_TO_STOP, {});

                    // #6 - Kate got an event that John changed play state to stop
                    socketClient2.once(CHANGED_PLAY_STATE_TO_STOP, res => {
                        assertEqualUserShort(res.user, resChangedPlayStateToStopClient2.user);

                        done();
                    });
                });
            });
        });

        it('when user is trying to set play state to stop but is not in any room', done => {
            // #1 - Change play state to stop
            socketClient1.emit(CHANGE_PLAY_STATE_TO_STOP, {});

            // #2 - User got an error that he is not in one room
            socketClient1.once(ERROR_OF_CHANGING_PLAY_STATE_TO_STOP, res => {
                const errorResponse = {
                    message: 'You are not in any of the rooms'
                };

                assert.deepEqual(res, errorResponse);

                done();
            });
        });
    });

    describe(`test requesting ${CHANGE_PLAY_STATE_TIME} event`, () => {
        it('when request has incorrect types of fields', done => {
            socketClient1.once(ERROR_OF_CHANGING_PLAY_STATE_TIME, res => {
                const errorResponse = {
                    message: 'Validation error',
                    fields: {
                        'currentTime': [
                            "Current time must be of type number"
                        ]
                    }
                };

                assert.deepEqual(res, errorResponse);

                done();
            });

            socketClient1.emit(CHANGE_PLAY_STATE_TIME, {currentTime: '207.141845'});
        });

        it('when user in the room and is trying to set play time', done => {
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

            const reqChangePlayStateTimeClient1 = {
                currentTime: 207.141845
            };

            const resChangedPlayStateTimeClient2 = {
                user: {
                    name: 'John'
                },
                currentTime: 207.141845
            };

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient1);

            // #2 - John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqJoinUserToRoomClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    // #5 - Change play state time by John
                    socketClient1.emit(CHANGE_PLAY_STATE_TIME, reqChangePlayStateTimeClient1);

                    // #6 - Kate got an event that John changed play state time
                    socketClient2.once(CHANGED_PLAY_STATE_TIME, res => {
                        assertEqualUserShort(res.user, resChangedPlayStateTimeClient2.user);
                        assert.equal(res.currentTime, resChangedPlayStateTimeClient2.currentTime);

                        done();
                    });
                });
            });
        });

        it('when user is trying to set play state time but is not in any room', done => {
            const reqChangePlayStateTimeClient1 = {
                currentTime: 207.141845
            };

            // #1 - Change play state time
            socketClient1.emit(CHANGE_PLAY_STATE_TIME, reqChangePlayStateTimeClient1);

            // #2 - User got an error that he is not in one room
            socketClient1.once(ERROR_OF_CHANGING_PLAY_STATE_TIME, res => {
                const errorResponse = {
                    message: 'You are not in any of the rooms'
                };

                assert.deepEqual(res, errorResponse);

                done();
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