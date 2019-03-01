import $ from 'jquery';

import {Observer} from './subjects';
import {ALLOWED_VIDEO_TYPES} from "./constants";

import './JoinRoomDialog.css';

export default class JoinRoomDialog {
    constructor(webSocketClient, subjectsManager, onSuccessCallback) {
        this._client = webSocketClient;
        this._subjects = subjectsManager;
        this._onSuccessCallback = onSuccessCallback;
        this._selectedFile = null;

        // Find elements
        this._root = $('#modalJoinRoom');
        this._inputUserName = $('#inputUserName');
        this._inputUserFile = $('#inputUserFile');
        this._inputRoomName = $('#inputRoomName');
        this._buttonJoinRoom = $('#buttonJoinRoom');
        this._blockErrorsUserName = $('.join-room-dialog__error-user-name');
        this._blockErrorsUserFile = $('.join-room-dialog__error-user-file');
        this._blockErrorsRoomName = $('.join-room-dialog__error-room-name');

        // Set parameters
        this._root.modal({
          backdrop: 'static',
          keyboard: false
        });

        // Subscribe observers on events
        this._youJoinedRoomObserver = new Observer(this._handleYouJoinedRoomEvent.bind(this));
        this._youReconnectedRoomObserver = new Observer(this._handleYouReconnectedToRoomEvent.bind(this));
        this._errorOfJoiningUserToRoomObserver = new Observer(this._handleErrorOfJoiningUserToRoomEvent.bind(this));

        this._subjects.youJoinedRoomSubject.subscribe(this._youJoinedRoomObserver);
        this._subjects.youReconnectedToRoomSubject.subscribe(this._youReconnectedRoomObserver);
        this._subjects.errorOfJoiningUserToRoomSubject.subscribe(this._errorOfJoiningUserToRoomObserver);

        // Set listeners
        this._buttonJoinRoom.click(this._joinRoomButtonClick.bind(this));

        this._root.on('hidden.bs.modal', () => {
            this._subjects.youJoinedRoomSubject.unsubscribe(this._youJoinedRoomObserver);
            this._subjects.youReconnectedToRoomSubject.unsubscribe(this._youReconnectedRoomObserver);
            this._subjects.errorOfJoiningUserToRoomSubject.unsubscribe(this._errorOfJoiningUserToRoomObserver);
        });
    }

    showDialog() {
        this._root.modal('show');
    }

    hideDialog() {
        this._root.modal('hide');
    }

    _joinRoomButtonClick() {
        const userName = this._inputUserName.val();
        const roomName = this._inputRoomName.val();
        const file = this._inputUserFile[0].files[0];

        let isValid = true;

        // Validate user name
        if (!userName) {
            isValid = false;

            this._inputUserName.addClass('is-invalid');
            this._blockErrorsUserName.text('Please provide user name.');
        } else {
            this._inputUserName.removeClass('is-invalid');
            this._blockErrorsUserName.empty();
        }

        // Validate room name
        if (!roomName) {
            isValid = false;

            this._inputRoomName.addClass('is-invalid');
            this._blockErrorsRoomName.text('Please provide room name.');
        } else {
            this._inputRoomName.removeClass('is-invalid');
            this._blockErrorsRoomName.empty();
        }

        // Validate user file
        if (!file) {
            isValid = false;

            this._inputUserFile.addClass('is-invalid');
            this._blockErrorsUserFile.text('Please provide a file.');
        } else if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
            isValid = false;

            this._inputUserFile.addClass('is-invalid');
            this._blockErrorsUserFile.text('Please select mp4 or webm file.');
        } else {
            this._inputUserFile.removeClass('is-invalid');
            this._blockErrorsUserFile.empty();
        }

        if (!isValid) {
            return;
        }

        this._selectedFile = file;

        const user = {
            name: userName,
            file: {
                name: file.name,
                size: file.size
            }
        };

        const room = {
            name: roomName
        };

        // Join user to room
        this._client.joinUserToRoom(user, room);
    }

    _handleYouJoinedRoomEvent(res) {
        this._onSuccessCallback(res, this._selectedFile);
        this.hideDialog();
    }

    _handleYouReconnectedToRoomEvent(res) {
        this._onSuccessCallback(res, this._selectedFile);
        this.hideDialog();
    }

    _handleErrorOfJoiningUserToRoomEvent(res) {
        if (!res.message || res.message !== 'Validation error')
            return;

        if (res.fields['user.name']) {
            this._inputUserName.addClass('is-invalid');
            this._blockErrorsUserName.html(res.fields['user.name'].join('<br/>'));
        } else {
            this._inputUserName.removeClass('is-invalid');
            this._blockErrorsUserName.empty();
        }

        if (res.fields['user.file']) {
            let errors = res.fields['user.file'].join('<br/>');

            if (res.fields['user.file.name']) {
                errors += '<br/>' + res.fields['user.file.name'].join('<br/>');
            }
            if (res.fields['user.file.size']) {
                errors += '<br/>' + res.fields['user.file.size'].join('<br/>');
            }

            this._inputUserFile.addClass('is-invalid');
            this._blockErrorsUserFile.html(errors);
        } else {
            this._inputUserFile.removeClass('is-invalid');
            this._blockErrorsUserFile.empty();
        }

        if (res.fields['room.name']) {
            this._inputRoomName.addClass('is-invalid');
            this._blockErrorsRoomName.html(res.fields['room.name'].join('<br/>'));
        } else {
            this._inputRoomName.removeClass('is-invalid');
            this._blockErrorsRoomName.empty();
        }
    }
}
