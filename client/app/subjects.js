import randomstring from 'randomstring';

export class Observer {
    constructor(onNotifyCallback) {
        const ID_LENGTH = 7;

        this._id = randomstring.generate(ID_LENGTH);
        this._onNotifyCallback = onNotifyCallback;
    }

    get id() {
        return this._id;
    }

    notify(res) {
        this._onNotifyCallback(res);
    }
}


class BaseSubject {
    constructor(observers = new Map()) {
        this._observers = observers;
    }

    subscribe(observer) {
        if (!observer instanceof Observer) throw new Error('Argument should be observer instance');
        this._observers.set(observer.id, observer);
    }

    unsubscribe(observer) {
        if (!observer instanceof Observer) throw new Error('Argument should be observer instance');

        if (this._observers.has(observer.id)) {
            this._observers.delete(observer.id);
        }
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

export class ChangedPlayStateSubject extends BaseSubject {}

export class ErrorOfChangingPlayStateSubject extends BaseSubject {}

export class SentMessageToRoomSubject extends BaseSubject {}

export class ErrorOfSendingMessageToRoomSubject extends BaseSubject {}

export class DisconnectSubject extends BaseSubject {}

export class ReconnectingSubject extends BaseSubject {}

export class ReconnectSubject extends BaseSubject {}
