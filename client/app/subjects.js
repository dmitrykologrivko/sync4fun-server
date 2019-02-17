class BaseSubject {
    constructor(observers = []) {
        this._observers = observers;
    }

    subscribe(observer) {
        this._observers.push(observer);
    }

    unsubscribe(observer) {
        const index = this._observers.indexOf(observer);
        if (index > -1) this._observers.slice(index);
    }

    publish(res) {
        this._observers.forEach(observer => (observer.notify(res)));
    }
}

export class YouJoinedRoomSubject extends BaseSubject {}

export class UserJoinedRoomSubject extends BaseSubject {}

export class YouReconnectedToRoomSubject extends BaseSubject {}

export class UserReconnectedToRoomSubject extends BaseSubject {}

export class ErrorOfJoiningUserToRoomSubject extends BaseSubject {}

export class YouLeftRoomSubject extends BaseSubject {}

export class UserLeftRoomSubject extends BaseSubject {}

export class ErrorOfLeavingRoomSubject extends BaseSubject {}

export class ChangedPlayStateToPlaySubject extends BaseSubject {}

export class ErrorOfChangingPlayStateToPlaySubject extends BaseSubject {}

export class ChangedPlayStateToPauseSubject extends BaseSubject {}

export class ErrorOfChangingPlayStateToPauseSubject extends BaseSubject {}

export class ChangedPlayStateToStopSubject extends BaseSubject {}

export class ErrorOfChangingPlayStateToStopSubject extends BaseSubject {}
