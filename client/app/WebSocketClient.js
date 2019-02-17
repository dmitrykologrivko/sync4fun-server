import {
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
} from './constants';

export default class WebSocketClient {
    constructor(socket, subjectsManager) {
        this._socket = socket;
        this._subjectsManager = subjectsManager;

        this._setResponseListeners();
    }

    _setResponseListeners() {
        this._socket.once(YOU_JOINED_ROOM, res => {

        });

        this._socket.once(USER_JOINED_ROOM, res => {

        });

        this._socket.once(YOU_RECONNECTED_TO_ROOM, res => {

        });

        this._socket.once(USER_RECONNECTED_TO_ROOM, res => {

        });

        this._socket.once(ERROR_OF_JOINING_USER_TO_ROOM, res => {

        });

        this._socket.once(YOU_LEFT_ROOM, res => {

        });

        this._socket.once(USER_LEFT_ROOM, res => {

        });

        this._socket.once(ERROR_OF_LEAVING_USER_FROM_ROOM, res => {

        });

        this._socket.once(CHANGED_PLAY_STATE_TO_PLAY, res => {

        });

        this._socket.once(ERROR_OF_CHANGING_PLAY_STATE_TO_PLAY, res => {

        });

        this._socket.once(CHANGED_PLAY_STATE_TO_PAUSE, res => {

        });

        this._socket.once(ERROR_OF_CHANGING_PLAY_STATE_TO_PAUSE, res => {

        });

        this._socket.once(CHANGED_PLAY_STATE_TO_STOP, res => {

        });

        this._socket.once(ERROR_OF_CHANGING_PLAY_STATE_TO_STOP, res => {

        });
    }

    joinUserToRoom(user, room) {
        this._socket.emit(JOIN_USER_TO_ROOM, {
            user,
            room
        });
    }

    leaveUserFromRoom() {
        this._socket.emit(LEAVE_USER_FROM_ROOM);
    }

    changePlayStateToPlay() {
        this._socket.emit(CHANGE_PLAY_STATE_TO_PLAY);
    }

    changePlayStateToPause() {
        this._socket.emit(CHANGE_PLAY_STATE_TO_PAUSE);
    }

    changePlayStateToStop() {
        this._socket.emit(CHANGE_PLAY_STATE_TO_STOP);
    }
}
