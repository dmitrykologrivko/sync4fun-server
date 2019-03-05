import {
    YouJoinedRoomSubject,
    UserJoinedRoomSubject,
    YouReconnectedToRoomSubject,
    UserReconnectedToRoomSubject,
    ErrorOfJoiningUserToRoomSubject,
    YouLeftRoomSubject,
    UserLeftRoomSubject,
    ErrorOfLeavingRoomSubject,
    ChangedPlayStateToPlaySubject,
    ErrorOfChangingPlayStateToPlaySubject,
    ChangedPlayStateToPauseSubject,
    ErrorOfChangingPlayStateToPauseSubject,
    ChangedPlayStateToStopSubject,
    ErrorOfChangingPlayStateToStopSubject,
    ChangedPlayStateTimeSubject,
    ErrorOfChangingPlayStateTimeSubject
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
        this._cangedPlayStateToPlaySubject = new ChangedPlayStateToPlaySubject();
        this._errorOfChangingPlayStateToPlaySubject = new ErrorOfChangingPlayStateToPlaySubject();
        this._cangedPlayStateToPauseSubject = new ChangedPlayStateToPauseSubject();
        this._errorOfChangingPlayStateToPauseSubject = new ErrorOfChangingPlayStateToPauseSubject();
        this._cangedPlayStateToStopSubject = new ChangedPlayStateToStopSubject();
        this._errorOfChangingPlayStateToStopSubject = new ErrorOfChangingPlayStateToStopSubject();
        this._cangedPlayStateTimeSubject = new ChangedPlayStateTimeSubject();
        this._errorOfChangingPlayStateTimeSubject = new ErrorOfChangingPlayStateTimeSubject();
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

    get changePlayStateToPlaySubject() {
        return this._cangedPlayStateToPlaySubject;
    }

    get errorOfChangingPlayStateToPlaySubject() {
        return this._errorOfChangingPlayStateToPlaySubject;
    }

    get changedPlayStateToPauseSubject() {
        return this._cangedPlayStateToPauseSubject;
    }

    get errorOfChangingPlayStateToPauseSubject() {
        return this._errorOfChangingPlayStateToPauseSubject;
    }

    get changedPlayStateToStopSubject() {
        return this._cangedPlayStateToStopSubject;
    }

    get errorOfChangingPlayStateToStopSubject() {
        return this._errorOfChangingPlayStateToStopSubject;
    }

    get changedPlayStateTimeSubject() {
        return this._cangedPlayStateTimeSubject;
    }

    get errorOfChangingPlayStateTimeSubject() {
        return this._errorOfChangingPlayStateTimeSubject;
    }
}
