import $ from 'jquery';

import JoinRoomDialog from './JoinRoomDialog';
import {Observer} from './subjects';

export default class AppController {
    constructor(webSocketClient, subjectsManager, player) {
        this._client = webSocketClient;
        this._subjects = subjectsManager;
        this._joinRoomDialog = new JoinRoomDialog(this._client, this._subjects, this._onSuccessJoinToRoom.bind(this));
        this._user = {};
        this._room = {};

        // Find elements
        this._lableRoomName = $('#labelRoomName');
        this._lableUserName = $('#labelUserName');
        this._labelFileName = $('#labelFileName');
        this._listEvents = $('.events-list');
        this._player = player('my-video');

        // Subscribe observers on events
        this._userJoinedRoomObserver = new Observer(this._handleUserJoinedRoomEvent.bind(this));
        this._userReconnectedToRoomObserver = new Observer(this._handleUserReconnectedToRoomEvent.bind(this));
        this._userLeftRoomObserver = new Observer(this._handleUserLeftRoomEvent.bind(this));
        this._youLeftRoomObserver = new Observer(this._handleYouLeftRoomEvent.bind(this));
        this._errorOfLeavingRoomObserver = new Observer(this._handleErrorOfLeavingRoomObserver.bind(this));
        this._cangedPlayStateToPlayObserver = new Observer(this._handleCangedPlayStateToPlayEvent.bind(this));
        this._errorOfChangingPlayStateToPlayObserver = new Observer(this._handleCangedPlayStateToPlayEvent.bind(this));
        this._cangedPlayStateToPauseObserver = new Observer(this._handleCangedPlayStateToPauseEvent.bind(this));
        this._errorOfChangingPlayStateToPauseObserver = new Observer(this._handleCangedPlayStateToPauseEvent.bind(this));
        this._cangedPlayStateToStopObserver = new Observer(this._handleCangedPlayStateToStopEvent.bind(this));
        this._errorOfChangingPlayStateToStopObserver = new Observer(this._handleCangedPlayStateToStopEvent.bind(this));

        this._subjects.userJoinedRoomSubject.subscribe(this._userJoinedRoomObserver);
        this._subjects.userReconnectedToRoomSubject.subscribe(this._userReconnectedToRoomObserver);
        this._subjects.userLeftRoomSubject.subscribe(this._userLeftRoomObserver);
        this._subjects.youLeftRoomSubject.subscribe(this._youLeftRoomObserver);
        this._subjects.errorOfLeavingRoomSubject.subscribe(this._errorOfLeavingRoomObserver);
        this._subjects.cangedPlayStateToPlaySubject.subscribe(this._cangedPlayStateToPlayObserver);
        this._subjects.errorOfChangingPlayStateToPlaySubject.subscribe(this._errorOfChangingPlayStateToPlayObserver);
        this._subjects.cangedPlayStateToPauseSubject.subscribe(this._cangedPlayStateToPauseObserver);
        this._subjects.errorOfChangingPlayStateToPauseSubject.subscribe(this._errorOfChangingPlayStateToPauseObserver);
        this._subjects.cangedPlayStateToStopSubject.subscribe(this._cangedPlayStateToStopObserver);
        this._subjects.errorOfChangingPlayStateToStopSubject.subscribe(this._errorOfChangingPlayStateToStopObserver);

        this._joinRoomDialog.showDialog();
    }

    _onSuccessJoinToRoom(res) {
        this._user = res.user;
        this._room = res.room;

        this._lableRoomName.html(`Room: <span class="badge badge-success">${this._room.name}</span>`);
        this._lableUserName.html(`User: <span class="badge badge-success">${this._user.name}</span>`);
        this._labelFileName.html(`File: <span class="badge badge-success">${this._user.file.name}</span>`);
    }

    _addEventToList(userName, message) {
        this._listEvents.append(`<li><span class="badge badge-info">${userName}</span> ${message}</li>`);
    }

    _handleUserJoinedRoomEvent(res) {
        this._addEventToList(res.user.name, 'Joined room');
    }

    _handleUserReconnectedToRoomEvent(res) {
        this._addEventToList(res.user.name, 'Reconnected to room');
    }

    _handleUserLeftRoomEvent(res) {
        this._addEventToList(res.user.name, 'Left room');
    }

    _handleYouLeftRoomEvent(res) {

    }

    _handleErrorOfLeavingRoomObserver(res) {
        console.error(res);
    }

    _handleCangedPlayStateToPlayEvent(res) {

    }

    _handleErrorOfChangingPlayStateToPlayEvent(res) {
        console.error(res);
    }

    _handleCangedPlayStateToPauseEvent(res) {

    }

    _handleErrorOfChangingPlayStateToPauseEvent(res) {
        console.error(res);
    }

    _handleCangedPlayStateToStopEvent(res) {

    }

    _handleErrorOfChangingPlayStateToStopEvent(res) {
        console.error(res);
    }
}
