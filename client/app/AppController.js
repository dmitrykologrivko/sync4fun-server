import $ from 'jquery';
import videojs from 'video.js';

import 'video.js/dist/video-js.min.css';

import {
    PLAY_STATE_PLAYING,
    PLAY_STATE_PAUSE,
    PLAY_STATE_STOP
} from './constants';

import JoinRoomDialog from './JoinRoomDialog';
import {Observer} from './subjects';
import {convertBytesToMegabytes} from './utils';

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
        this._changedPlayStateObserver = new Observer(this._handleChangedPlayStateEvent.bind(this));
        this._errorOfChangingPlayStateObsever = new Observer(this._handleErrorOfChangingPlayStateEvent.bind(this));
        this._cangedPlayStateToPlayObserver = new Observer(this._handleChangedPlayStateToPlayEvent.bind(this));
        this._errorOfChangingPlayStateToPlayObserver = new Observer(this._handleChangedPlayStateToPlayEvent.bind(this));
        this._cangedPlayStateToPauseObserver = new Observer(this._handleChangedPlayStateToPauseEvent.bind(this));
        this._errorOfChangingPlayStateToPauseObserver = new Observer(this._handleChangedPlayStateToPauseEvent.bind(this));
        this._cangedPlayStateToStopObserver = new Observer(this._handleChangedPlayStateToStopEvent.bind(this));
        this._errorOfChangingPlayStateToStopObserver = new Observer(this._handleChangedPlayStateToStopEvent.bind(this));
        this._cangedPlayStateTimeObserver = new Observer(this._handleChangedPlayStateTimeEvent.bind(this));
        this._errorOfChangingPlayStateTimeObserver = new Observer(this._handleChangedPlayStateTimeEvent.bind(this));

        this._subjects.userJoinedRoomSubject.subscribe(this._userJoinedRoomObserver);
        this._subjects.userReconnectedToRoomSubject.subscribe(this._userReconnectedToRoomObserver);
        this._subjects.userLeftRoomSubject.subscribe(this._userLeftRoomObserver);
        this._subjects.youLeftRoomSubject.subscribe(this._youLeftRoomObserver);
        this._subjects.errorOfLeavingRoomSubject.subscribe(this._errorOfLeavingRoomObserver);
        this._subjects.changedPlayStateSubject.subscribe(this._changedPlayStateObserver);
        this._subjects.errorOfChangingPlayStateSubject.subscribe(this._errorOfChangingPlayStateObsever);
        this._subjects.changePlayStateToPlaySubject.subscribe(this._cangedPlayStateToPlayObserver);
        this._subjects.errorOfChangingPlayStateToPlaySubject.subscribe(this._errorOfChangingPlayStateToPlayObserver);
        this._subjects.changedPlayStateToPauseSubject.subscribe(this._cangedPlayStateToPauseObserver);
        this._subjects.errorOfChangingPlayStateToPauseSubject.subscribe(this._errorOfChangingPlayStateToPauseObserver);
        this._subjects.changedPlayStateToStopSubject.subscribe(this._cangedPlayStateToStopObserver);
        this._subjects.errorOfChangingPlayStateToStopSubject.subscribe(this._errorOfChangingPlayStateToStopObserver);
        this._subjects.changedPlayStateTimeSubject.subscribe(this._cangedPlayStateTimeObserver);
        this._subjects.errorOfChangingPlayStateTimeSubject.subscribe(this._errorOfChangingPlayStateTimeObserver);

        // Set listeners
        this._player.controlBar.playToggle.on('click', this._playToggleButtonClick.bind(this));
        this._player.bigPlayButton.on('click', this._playToggleButtonClick.bind(this));
        this._player.tech_.on('mouseup', this._playToggleButtonClick.bind(this));

        this._player.controlBar.progressControl.on('mousedown', this._videoSeeked.bind(this));
        this._player.controlBar.progressControl.seekBar.on('mousedown', this._videoSeeked.bind(this));

        this._buttonShowUsers.on('click', this._showUsersButtonClick.bind(this));

        this._linkLeaveRoom.on('click', this._leaveRoomLickClick.bind(this));

        this._joinRoomDialog.showDialog();
    }

    _onSuccessJoinToRoom(res, selectedFile) {
        this._user = res.user;
        this._room = res.room;
        const fileSize = convertBytesToMegabytes(this._user.file.size);

        this._lableRoomName.html(`${this._room.name} <a class="room-info__leave-link" href="/">Leave</a>`);
        this._labelFileName.text(this._user.file.name);
        this._labelFileSize.text(`Size: ${Number(fileSize).toFixed(2)}MB`);

        this._updateUsersList();

        this._player.src({
            type: selectedFile.type,
            src: URL.createObjectURL(selectedFile)
        });
        this._player.ready(() => {
            const playState = this._room.playState;
            const currentTime = this._room.currentTime;

            if (playState === PLAY_STATE_PLAYING) {
                this._player.currentTime(currentTime);
                this._player.play();
                return;
            }

            if (playState === PLAY_STATE_PAUSE) {
                this._player.currentTime(currentTime);
                this._player.pause();
                return;
            }

            if (playState === PLAY_STATE_STOP) {
                this._player.stop();
            }
        });
    }

    _updateUsersList() {
        this._listUsers.empty();

        for (let user of this._room.users) {
            const name = user.id === this._user.id
                ? `${user.name} (You)`
                : user.name;
            const fileSize = convertBytesToMegabytes(this._user.file.size);

            this._listUsers.append(`
                <li class="users-list__item">
                    <div class="users-list__user">${name}</div>
                    <div class="users-list__file-name">${user.file.name}</div>
                    <div class="users-list__file-size">Size: ${Number(fileSize).toFixed(2)}MB</div>
                </li>
            `);
        }

        this._buttonShowUsers.removeClass('d-none');
        this._buttonShowUsers.text(`
            ${this._room.users.length} ${this._room.users.length === 1 ? 'user' : 'users'} in room
        `);
    }

    _addEventToList(userName, message) {
        this._listEvents.append(`
            <li class="events-list__item">
                <div class="events-list__user">${userName}</div>
                <div class="events-list__message">${message}</div>
            </li>
        `);

        const scrollPosition = this._listEvents.scrollTop();
        const scrollHeight = this._listEvents.prop("scrollHeight");
        const listHeight = this._listEvents.height();

        if ((scrollPosition + listHeight) > (scrollHeight - listHeight)) {
            this._listEvents.animate({scrollTop: scrollHeight});
        }
    }

    _videoSeeked() {
        document.onmouseup = () => {
            const currentTime = this._player.currentTime();

            this._client.changePlayState({
                playState: PLAY_STATE_PLAYING,
                currentTime: currentTime,
                seek: true
            });
            this._addEventToList('You', 'Changed time');

            document.onmouseup = null;
        };
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
            this._client.changePlayState({
                playState: PLAY_STATE_PAUSE,
                currentTime: this._player.currentTime(),
                seek: false
            });
            this._addEventToList('You', 'Paused playing');
        } else {
            this._client.changePlayState({
                playState: PLAY_STATE_PLAYING,
                currentTime: this._player.currentTime(),
                seek: false
            });
            this._addEventToList('You', 'Started playing');
        }
    }

    _leaveRoomLickClick() {
        this._client.leaveUserFromRoom();
    }

    _handleUserJoinedRoomEvent(res) {
        this._addEventToList(res.user.name, 'Joined room');

        this._room.users.push(res.user);
        this._updateUsersList();
    }

    _handleUserReconnectedToRoomEvent(res) {
        this._addEventToList(res.user.name, 'Reconnected to room');

        this._room.users.push(res.user);
        this._updateUsersList();
    }

    _handleUserLeftRoomEvent(res) {
        this._addEventToList(res.user.name, 'Left room');

        this._room.users = this._room.users.filter(user => res.user.id !== user.id);
        this._updateUsersList();
    }

    _handleYouLeftRoomEvent(res) {
        this._addEventToList('You', 'Left room');
    }

    _handleErrorOfLeavingRoomObserver(res) {
        console.error(res);
    }

    _handleChangedPlayStateEvent(res) {
        const playState = res.playState;
        const currentTime = res.currentTime;
        const seek = res.seek;
        const updatedBy = res.updatedBy;

        if (seek) {
            this._addEventToList(updatedBy.name, 'Changed time');
            this._player.currentTime(currentTime);
            return;
        }

        if (playState === PLAY_STATE_PLAYING) {
            this._addEventToList(updatedBy.name, 'Started playing');
            this._player.play();
            return;
        }

        if (playState === PLAY_STATE_PAUSE) {
            this._addEventToList(updatedBy.name, 'Paused playing');
            this._player.pause();
            return;
        }

        if (playState === PLAY_STATE_STOP) {
            this._addEventToList(updatedBy.name, 'Stopped playing');
            this._player.stop();
        }
    }

    _handleErrorOfChangingPlayStateEvent(res) {
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

    _handleChangedPlayStateTimeEvent(res) {
        this._addEventToList(res.user.name, 'Changed time');
        this._player.currentTime(res.currentTime);
    }

    _handleErrorOfChangingPlayStateTimeEvent(res) {
        console.error(res);
    }
}
