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
} = require('../constants').events;

describe('Events test', () => {
    let httpServer;
    let httpServerAddr;
    let socketServer;
    let socketClient1;
    let socketClient2;
    let socketClient3;
    let roomManager;

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

        it('when request is invalid', done => {
            socketClient1.once(ERROR_OF_JOINING_USER_TO_ROOM, res => {
                const errorResponse = {
                    message: 'Validation error',
                    fields: {
                        'room.name': [
                            "Room name must be of type string"
                        ],
                        'user.file.name': [
                            "User file name must be of type string"
                        ],
                        'user.file.size': [
                            "User file size must be of type number"
                        ],
                        'user.name': [
                            "User name must be of type string"
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
                        size: '1'
                    }
                },
                room: {
                    name: 1
                }
            });
        });

        it('when new user tries to join the room', done => {
            const reqClient1 = {
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

            const reqClient2 = {
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

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqClient1);

            // #2 - John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                assert.isDefined(res.user.id);
                assert.equal(res.user.name, reqClient1.user.name);
                assert.equal(res.user.file.name, reqClient1.user.file.name);
                assert.equal(res.user.file.size, reqClient1.user.file.size);
                assert.equal(res.room.name, reqClient1.room.name);

                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    assert.isDefined(res.user.id);
                    assert.equal(res.user.name, reqClient2.user.name);
                    assert.equal(res.user.file.name, reqClient2.user.file.name);
                    assert.equal(res.user.file.size, reqClient2.user.file.size);
                    assert.equal(res.room.name, reqClient2.room.name);

                    // #5 - John got an event that Kate joined
                    socketClient1.once(USER_JOINED_ROOM, res => {
                        assert.isDefined(res.user.id);
                        assert.equal(res.user.name, reqClient2.user.name);

                        done();
                    });
                });
            });
        });

        it('when user uses this room already and tries to join again', done => {
            const reqClient1 = {
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

            const reqClient2 = {
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

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqClient1);

            // #2 - John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    // #5 - Try to reconnect John to "My room"
                    socketClient1.emit(JOIN_USER_TO_ROOM, reqClient1);

                    // #6 - John reconnected to "My room"
                    socketClient1.once(YOU_RECONNECTED_TO_ROOM, res => {
                        assert.isDefined(res.user.id);
                        assert.equal(res.user.name, reqClient1.user.name);
                        assert.equal(res.user.file.name, reqClient1.user.file.name);
                        assert.equal(res.user.file.size, reqClient1.user.file.size);
                        assert.equal(res.room.name, reqClient1.room.name);

                        // #7 - Kate got an event that John reconnected
                        socketClient2.once(USER_RECONNECTED_TO_ROOM, res => {
                            assert.isDefined(res.user.id);
                            assert.equal(res.user.name, reqClient1.user.name);

                            done();
                        });
                    });
                });
            });
        });

        it('when user uses another room but tries to join another one', done => {
            const reqClient1 = {
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

            const reqClient2 = {
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

            const reqClient3 = {
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

            const reqClient1Modified = {
                ...reqClient1,
                room: {
                    name: 'My room 2'
                }
            };

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqClient1);

            // #2 -  John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    // #5 - Connect Bob to "My room 2"
                    socketClient3.emit(JOIN_USER_TO_ROOM, reqClient3);

                    // #6 - Bob connected to "My room 2"
                    socketClient3.once(YOU_JOINED_ROOM, res => {
                        // #7 - Connect John to "My room 2"
                        socketClient1.emit(JOIN_USER_TO_ROOM, reqClient1Modified);

                        // #8 - Kate got an event that John came out from room
                        socketClient2.once(USER_LEFT_ROOM, res => {
                            assert.isDefined(res.user.id);
                            assert.equal(res.user.name, reqClient1.user.name);

                            // #9 - John connected to "My room 2"
                            socketClient1.once(YOU_JOINED_ROOM, res => {
                                assert.isDefined(res.user.id);
                                assert.equal(res.user.name, reqClient1Modified.user.name);
                                assert.equal(res.user.file.name, reqClient1Modified.user.file.name);
                                assert.equal(res.user.file.size, reqClient1Modified.user.file.size);
                                assert.equal(res.room.name, reqClient1Modified.room.name);

                                // #10 - Bob got an event that John joined
                                socketClient3.once(USER_JOINED_ROOM, res => {
                                    assert.isDefined(res.user.id);
                                    assert.equal(res.user.name, reqClient1.user.name);

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
            const reqClient1 = {
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

            const reqClient2 = {
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

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqClient1);

            // #2 - John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    // #5 - Leave John from "My room"
                    socketClient1.emit(LEAVE_USER_FROM_ROOM, {});

                    // #6 - John left "My room"
                    socketClient1.once(YOU_LEFT_ROOM, res => {
                        expect(res).to.be.empty;

                        // #7 - Kate got an event that John is left room
                        socketClient2.once(USER_LEFT_ROOM, res => {
                            assert.isDefined(res.user.id);
                            assert.equal(res.user.name, reqClient1.user.name);

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
            const reqClient1 = {
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

            const reqClient2 = {
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

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqClient1);

            // #2 - John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    // #5 - Change play state to play by John
                    socketClient1.emit(CHANGE_PLAY_STATE_TO_PLAY, reqClient1);

                    // #6 - Kate got an event that John changed play state to play
                    socketClient2.once(CHANGED_PLAY_STATE_TO_PLAY, res => {
                        assert.isDefined(res.user.id);
                        assert.equal(res.user.name, reqClient1.user.name);

                        done();
                    });
                });
            });
        });

        it('when is trying to set play state to play but is not in any room', done => {
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
            const reqClient1 = {
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

            const reqClient2 = {
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

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqClient1);

            // #2 - John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    // #5 - Change play state to pause by John
                    socketClient1.emit(CHANGE_PLAY_STATE_TO_PAUSE, reqClient1);

                    // #6 - Kate got an event that John changed play state to play
                    socketClient2.once(CHANGED_PLAY_STATE_TO_PAUSE, res => {
                        assert.isDefined(res.user.id);
                        assert.equal(res.user.name, reqClient1.user.name);

                        done();
                    });
                });
            });
        });

        it('when is trying to set play state to pause but is not in any room', done => {
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
            const reqClient1 = {
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

            const reqClient2 = {
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

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqClient1);

            // #2 - John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    // #5 - Change play state to stop by John
                    socketClient1.emit(CHANGE_PLAY_STATE_TO_STOP, reqClient1);

                    // #6 - Kate got an event that John changed play state to stop
                    socketClient2.once(CHANGED_PLAY_STATE_TO_STOP, res => {
                        assert.isDefined(res.user.id);
                        assert.equal(res.user.name, reqClient1.user.name);

                        done();
                    });
                });
            });
        });

        it('when is trying to set play state to stop but is not in any room', done => {
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

    describe('test disconnecting user', () => {
        it('when user was in any group', done => {
            const reqClient1 = {
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

            const reqClient2 = {
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

            // #1 - Connect John to "My room"
            socketClient1.emit(JOIN_USER_TO_ROOM, reqClient1);

            // #2 - John connected to "My room"
            socketClient1.once(YOU_JOINED_ROOM, res => {
                // #3 - Connect Kate to "My room"
                socketClient2.emit(JOIN_USER_TO_ROOM, reqClient2);

                // #4 - Kate connected to "My room"
                socketClient2.once(YOU_JOINED_ROOM, res => {
                    // #5 - John disconnected
                    socketClient1.disconnect();

                    // #6 - Kate got an event that John came out from room
                    socketClient2.once(USER_LEFT_ROOM, res => {
                        assert.isDefined(res.user.id);
                        assert.equal(res.user.name, reqClient1.user.name);

                        done();
                    });
                });
            });
        });
    });

});