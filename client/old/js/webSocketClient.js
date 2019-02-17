// Socket IO debug mode
localStorage.debug = '*';

function WebSocketClient() {
    this._socket = io();

    this._socket.on('you joined to room', function (res) {
        if (window.subjects) window.subjects.youJoinedToRoom.publish(res);
    });

    this._socket.on('you re-connected to room', function (res) {
        if (window.subjects) window.subjects.youReConnectedToRoom.publish(res);
    });

    this._socket.on('you left room', function (res) {
        if (window.subjects) window.subjects.youLeftRoom.publish(res);
    });

    this._socket.on('user joined to room', function (res) {
        if (window.subjects) window.subjects.userJoinedToRoom.publish(res);
    });

    this._socket.on('user re-connected to room', function (res) {
        if (window.subjects) window.subjects.userReConnectedToRoom.publish(res);
    });

    this._socket.on('user left room', function (res) {
        if (window.subjects) window.subjects.userLeftRoom.publish(res);
    });

    this._socket.on('user changed play state to play', function (res) {
        if (window.subjects) window.subjects.userChangedPlayStateToPlay.publish(res);
    });

    this._socket.on('user changed play state to pause', function (res) {
        if (window.subjects) window.subjects.userChangedPlayStateToPause.publish(res);
    });

    this._socket.on('user changed play state to stop', function (res) {
        if (window.subjects) window.subjects.userChangedPlayStateToStop.publish(res);
    });
}

WebSocketClient.prototype.joinUserToRoom = function (req) {
    this._socket.emit('user join room', req);
};

WebSocketClient.prototype.leaveRoom = function() {
    this._socket.emit('user leave room', {});
};

WebSocketClient.prototype.play = function(req) {
    this._socket.emit('user change play state to play', req);
};

WebSocketClient.prototype.pause = function(req) {
    this._socket.emit('user change play state to pause', req);
};

WebSocketClient.prototype.stop = function(req) {
    this._socket.emit('user change play state to stop', req);
};

window.webSocketClient = new WebSocketClient();