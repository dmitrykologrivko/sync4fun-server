$(function () {

    /* Module variables */

    var client = window.webSocketClient;

    /* Module functions */

    function updateRoomInformation(user, room) {
        $('#roomTitle').html('Room: <span class="badge badge-success">' + room.name + '</span> <a id="leaveRoom" href="/">Leave</a>');
        $('#roomWatcherName').html('Watcher: <span class="badge badge-success">' + user.name + '</span>');

        // setup leave room click
        $('#leaveRoom').click(function () {
            client.leaveRoom();
        });
    }

    function addRoomEvent(user, message) {
        $('.events-list').append('<li><span class="badge badge-info">' + user.name + '</span> ' + message + '</li>');
    }

    /* Module observers */

    var YouJoinedToRoomObserver = function () {
        return {
            notify(res) {
                $('#joinRoomModal').modal('hide');
                updateRoomInformation(res.user, res.room);
                addRoomEvent(res.user, 'Connected to room');
            }
        }
    };

    var YouReConnectedToRoomObserver = function () {
        return {
            notify(res) {
                $('#joinRoomModal').modal('hide');
                updateRoomInformation(res.user, res.room);
                addRoomEvent(res.user, 'Re-connected to room');
            }
        }
    };

    var YouLeftRoomObserver = function () {
        return {
            notify(res) {
                console.log('You have left the room');
            }
        }
    };

    var UserJoinedToRoomObserver = function () {
        return {
            notify(res) {
                addRoomEvent(res.user, 'Connected to room');
            }
        }
    };

    var UserReConnectedToRoomObserver = function() {
        return {
            notify(res) {
                addRoomEvent(res.user, 'Re-connected to room');
            }
        }
    };

    var UserLeftRoomObserver = function() {
        return {
            notify(res) {
                addRoomEvent(res.user, 'Left room');
            }
        }
    };

    /* Subscribe observers */

    window.subjects.youJoinedToRoom.subscribe(new YouJoinedToRoomObserver());
    window.subjects.youReConnectedToRoom.subscribe(new YouReConnectedToRoomObserver());
    window.subjects.youLeftRoom.subscribe(new YouLeftRoomObserver());
    window.subjects.userJoinedToRoom.subscribe(new UserJoinedToRoomObserver());
    window.subjects.userReConnectedToRoom.subscribe(new UserReConnectedToRoomObserver());
    window.subjects.userLeftRoom.subscribe(new UserLeftRoomObserver());

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // show join to room modal window
    $('#joinRoomModal').modal({
        backdrop: 'static',
        keyboard: false
    });

    // setup join to room click
    $('#joinRoom').click(function () {
        client.joinUserToRoom({
            user: {
                name: $('#watcher-name').val()
            },
            room: {
                name: $('#room-name').val()
            }
        });
    });

});