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
    CHANGE_PLAY_STATE,
    CHANGED_PLAY_STATE,
    ERROR_OF_CHANGING_PLAY_STATE,
    SEND_MESSAGE_TO_ROOM,
    SENT_MESSAGE_TO_ROOM,
    ERROR_OF_SENDING_MESSAGE_TO_ROOM,
    DISCONNECT,
    CLIENT_DISCONNECT,
    RECONNECT,
    RECONNECTING
} from './constants';

export default class WebSocketClient {
    constructor(socket, subjectsManager) {
        this._socket = socket;
        this._subjectsManager = subjectsManager;

        this._setResponseListeners();
    }

    _setResponseListeners() {
        this._socket.on(YOU_JOINED_ROOM, res => {
            this._subjectsManager.youJoinedRoomSubject.publish(res);
        });

        this._socket.on(USER_JOINED_ROOM, res => {
            this._subjectsManager.userJoinedRoomSubject.publish(res);
        });

        this._socket.on(YOU_RECONNECTED_TO_ROOM, res => {
            this._subjectsManager.youReconnectedToRoomSubject.publish(res);
        });

        this._socket.on(USER_RECONNECTED_TO_ROOM, res => {
            this._subjectsManager.userReconnectedToRoomSubject.publish(res);
        });

        this._socket.on(ERROR_OF_JOINING_USER_TO_ROOM, res => {
            this._subjectsManager.errorOfJoiningUserToRoomSubject.publish(res);
        });

        this._socket.on(YOU_LEFT_ROOM, res => {
            this._subjectsManager.youLeftRoomSubject.publish(res);
        });

        this._socket.on(USER_LEFT_ROOM, res => {
            this._subjectsManager.userLeftRoomSubject.publish(res);
        });

        this._socket.on(ERROR_OF_LEAVING_USER_FROM_ROOM, res => {
            this._subjectsManager.errorOfLeavingRoomSubject.publish(res);
        });

        this._socket.on(CHANGED_PLAY_STATE, res => {
            this._subjectsManager.changedPlayStateSubject.publish(res);
        });

        this._socket.on(ERROR_OF_CHANGING_PLAY_STATE, res => {
            this._subjectsManager.errorOfChangingPlayStateSubject.publish(res);
        });

        this._socket.on(SENT_MESSAGE_TO_ROOM, res => {
            this._subjectsManager.sentMessageToRoomSubject.publish(res);
        });

        this._socket.on(ERROR_OF_SENDING_MESSAGE_TO_ROOM, res => {
            this._subjectsManager.errorOfSendingMessageToRoomSubject.publish(res);
        });

        this._socket.on(DISCONNECT, reason => {
            if (reason === CLIENT_DISCONNECT)
                return;

            this._subjectsManager.disconnectSubject.publish(reason);
        });

        this._socket.on(RECONNECT, attempt => {
            this._subjectsManager.reconnectSubject.publish(attempt);
        });

        this._socket.on(RECONNECTING, attempt => {
            this._subjectsManager.reconnectingSubject.publish(attempt);
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

    changePlayState(playState) {
        this._socket.emit(CHANGE_PLAY_STATE, playState);
    }

    sendMessageToRoom(message) {
        this._socket.emit(SEND_MESSAGE_TO_ROOM, {message});
    }
}
