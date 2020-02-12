import {
    YouJoinedRoomSubject,
    UserJoinedRoomSubject,
    YouReconnectedToRoomSubject,
    UserReconnectedToRoomSubject,
    ErrorOfJoiningUserToRoomSubject,
    YouLeftRoomSubject,
    UserLeftRoomSubject,
    ErrorOfLeavingRoomSubject,
    ChangedPlayStateSubject,
    ErrorOfChangingPlayStateSubject,
    SentMessageToRoomSubject,
    ErrorOfSendingMessageToRoomSubject,
    DisconnectSubject,
    ReconnectingSubject,
    ReconnectSubject
} from './subjects';

export default class SubjectsManager {
    constructor() {
        this._youJoinedRoomSubject = new YouJoinedRoomSubject();
        this._userJoinedRoomSubject = new UserJoinedRoomSubject();
        this._youReconnectedToRoomSubject = new YouReconnectedToRoomSubject();
        this._userReconnectedToRoomSubject = new UserReconnectedToRoomSubject();
        this._errorOfJoiningUserToRoomSubject = new ErrorOfJoiningUserToRoomSubject();
        this._youLeftRoomSubject = new YouLeftRoomSubject();
        this._userLeftRoomSubject = new UserLeftRoomSubject();
        this._errorOfLeavingRoomSubject = new ErrorOfLeavingRoomSubject();
        this._changedPlayStateSubject = new ChangedPlayStateSubject();
        this._errorOfChangingPlayStateSubject = new ErrorOfChangingPlayStateSubject();
        this._sentMessageToRoomSubject = new SentMessageToRoomSubject();
        this._errorOfSendingMessageToRoomSubject = new ErrorOfSendingMessageToRoomSubject();
        this._disconnectSubject = new DisconnectSubject();
        this._reconnectingSubject = new ReconnectingSubject();
        this._reconnectSubject = new ReconnectSubject();
    }

    get youJoinedRoomSubject() {
        return this._youJoinedRoomSubject;
    }

    get userJoinedRoomSubject() {
        return this._userJoinedRoomSubject;
    }

    get youReconnectedToRoomSubject() {
        return this._youReconnectedToRoomSubject;
    }

    get userReconnectedToRoomSubject() {
        return this._userReconnectedToRoomSubject;
    }

    get errorOfJoiningUserToRoomSubject() {
        return this._errorOfJoiningUserToRoomSubject;
    }

    get youLeftRoomSubject() {
        return this._youLeftRoomSubject;
    }

    get userLeftRoomSubject() {
        return this._userLeftRoomSubject;
    }

    get errorOfLeavingRoomSubject() {
        return this._errorOfLeavingRoomSubject;
    }

    get changedPlayStateSubject() {
        return this._changedPlayStateSubject;
    }

    get errorOfChangingPlayStateSubject() {
        return this._errorOfChangingPlayStateSubject;
    }

    get sentMessageToRoomSubject() {
        return this._sentMessageToRoomSubject;
    }

    get errorOfSendingMessageToRoomSubject() {
        return this._errorOfSendingMessageToRoomSubject;
    }

    get disconnectSubject() {
        return this._disconnectSubject;
    }

    get reconnectingSubject() {
        return this._reconnectingSubject;
    }

    get reconnectSubject() {
        return this._reconnectSubject;
    }
}
