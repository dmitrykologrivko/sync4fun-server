import $ from 'jquery';
import videojs from 'video.js';

import 'video.js/dist/video-js.min.css';

import JoinRoomDialog from './JoinRoomDialog';
import {Observer} from './subjects';

import './AppController.css';

export default class AppController {
    constructor(webSocketClient, subjectsManager) {
        this._client = webSocketClient;
        this._subjects = subjectsManager;
        this._joinRoomDialog = new JoinRoomDialog(this._client, this._subjects, this._onSuccessJoinToRoom.bind(this));
        this._user = {};
        this._room = {};
        this._isUsersListVisible = false;

        // Find elements
        this._player = videojs('videoPlayer');
        this._lableRoomName = $('.room-info__room-name');
        this._labelFileName = $('.video-info__file-name');
        this._labelFileSize = $('.video-info__file-size');
        this._buttonShowUsers = $('.room-info__show-users-button');
        this._listUsers = $('.users-list');
        this._listEvents = $('.events-list');
        this._linkLeaveRoom = $('.room-info__leave-link');

        // Subscribe observers on events
        this._userJoinedRoomObserver = new Observer(this._handleUserJoinedRoomEvent.bind(this));
        this._userReconnectedToRoomObserver = new Observer(this._handleUserReconnectedToRoomEvent.bind(this));
        this._userLeftRoomObserver = new Observer(this._handleUserLeftRoomEvent.bind(this));
        this._youLeftRoomObserver = new Observer(this._handleYouLeftRoomEvent.bind(this));
        this._errorOfLeavingRoomObserver = new Observer(this._handleErrorOfLeavingRoomObserver.bind(this));
        this._cangedPlayStateToPlayObserver = new Observer(this._handleChangedPlayStateToPlayEvent.bind(this));
        this._errorOfChangingPlayStateToPlayObserver = new Observer(this._handleChangedPlayStateToPlayEvent.bind(this));
        this._cangedPlayStateToPauseObserver = new Observer(this._handleChangedPlayStateToPauseEvent.bind(this));
        this._errorOfChangingPlayStateToPauseObserver = new Observer(this._handleChangedPlayStateToPauseEvent.bind(this));
        this._cangedPlayStateToStopObserver = new Observer(this._handleChangedPlayStateToStopEvent.bind(this));
        this._errorOfChangingPlayStateToStopObserver = new Observer(this._handleChangedPlayStateToStopEvent.bind(this));

        this._subjects.userJoinedRoomSubject.subscribe(this._userJoinedRoomObserver);
        this._subjects.userReconnectedToRoomSubject.subscribe(this._userReconnectedToRoomObserver);
        this._subjects.userLeftRoomSubject.subscribe(this._userLeftRoomObserver);
        this._subjects.youLeftRoomSubject.subscribe(this._youLeftRoomObserver);
        this._subjects.errorOfLeavingRoomSubject.subscribe(this._errorOfLeavingRoomObserver);
        this._subjects.changePlayStateToPlaySubject.subscribe(this._cangedPlayStateToPlayObserver);
        this._subjects.errorOfChangingPlayStateToPlaySubject.subscribe(this._errorOfChangingPlayStateToPlayObserver);
        this._subjects.changedPlayStateToPauseSubject.subscribe(this._cangedPlayStateToPauseObserver);
        this._subjects.errorOfChangingPlayStateToPauseSubject.subscribe(this._errorOfChangingPlayStateToPauseObserver);
        this._subjects.changedPlayStateToStopSubject.subscribe(this._cangedPlayStateToStopObserver);
        this._subjects.errorOfChangingPlayStateToStopSubject.subscribe(this._errorOfChangingPlayStateToStopObserver);

        // Set listeners
        this._player.controlBar.playToggle.on('click', this._playToggleButtonClick.bind(this));
        this._player.bigPlayButton.on('click', this._playToggleButtonClick.bind(this));
        this._player.tech_.on('mousedown', this._playToggleButtonClick.bind(this));

        this._buttonShowUsers.on('click', this._showUsersButtonClick.bind(this));

        this._linkLeaveRoom.on('click', this._leaveRoomLickClick.bind(this));

        this._joinRoomDialog.showDialog();
    }

    _onSuccessJoinToRoom(res, selectedFile) {
        this._user = res.user;
        this._room = res.room;

        this._lableRoomName.html(`${this._room.name} <a class="room-info__leave-link" href="/">Leave</a>`);
        this._labelFileName.text(this._user.file.name);
        this._labelFileSize.text(`Size: ${this._user.file.size}MB`);

        this._player.src({
            type: selectedFile.type,
            src: URL.createObjectURL(selectedFile)
        });
    }

    _addEventToList(userName, message) {
        this._listEvents.append(`
            <li class="events-list__item">
                <div class="events-list__user">${userName}</div>
                <div class="events-list__message">${message}</div>
            </li>
        `);
    }

    _showUsersButtonClick() {
        if (this._isUsersListVisible) {
            this._listUsers.addClass('d-none');
            this._isUsersListVisible = false;
        } else {
            this._listUsers.removeClass('d-none');
            this._isUsersListVisible = true;
        }
    }

    _playToggleButtonClick() {
        if (this._player.paused()) {
            this._client.changePlayStateToPause();
            this._addEventToList('You', 'Paused playing');
        } else {
            this._client.changePlayStateToPlay();
            this._addEventToList('You', 'Started playing');
        }
    }

    _leaveRoomLickClick() {
        this._client.leaveUserFromRoom();
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
        this._addEventToList('You', 'Left room');
    }

    _handleErrorOfLeavingRoomObserver(res) {
        console.error(res);
    }

    _handleChangedPlayStateToPlayEvent(res) {
        this._addEventToList(res.user.name, 'Started playing');
        this._player.play();
    }

    _handleErrorOfChangingPlayStateToPlayEvent(res) {
        console.error(res);
    }

    _handleChangedPlayStateToPauseEvent(res) {
        this._addEventToList(res.user.name, 'Paused playing');
        this._player.pause();
    }

    _handleErrorOfChangingPlayStateToPauseEvent(res) {
        console.error(res);
    }

    _handleChangedPlayStateToStopEvent(res) {
        this._addEventToList(res.user.name, 'Stopped playing');
        this._player.stop();
    }

    _handleErrorOfChangingPlayStateToStopEvent(res) {
        console.error(res);
    }
}
