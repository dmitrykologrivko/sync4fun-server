function WebSocketClient() {
    this._socket = io();

    this._socket.on('you joined to room', function (res) {
        if (window.subjects) window.subjects.youJoinedToRoom.publish(res);
    });

    this._socket.on('you re-connected to room', function (res) {
        if (window.subjects) window.subjects.youReConnectedToRoom.publish(res);
    });
}

WebSocketClient.prototype.joinUserToRoom = function (req) {
    this._socket.emit('user join room', req);
};

window.webSocketClient = new WebSocketClient();