import $ from 'jquery';

import JoinRoomDialog from './JoinRoomDialog';

export default class AppController {
    constructor(webSocketClient, subjectsManager) {
        this._client = webSocketClient;
        this._subjects = subjectsManager;
        this._joinRoomDialog = new JoinRoomDialog(this._client, this._subjects, this._handleYouJoinedRoomEvent.bind(this));

        $('#roomTitle').html('<span>This is span</span>');

        this._joinRoomDialog.showDialog();
    }

    _handleYouJoinedRoomEvent(res) {

    }
}
