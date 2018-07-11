$(function () {

    /* Module variables */

    var client = window.webSocketClient;

    /* Module functions */

    function updateRoomInformation(user, room) {
        $('#roomTitle').html('Room: <span class="badge badge-success">' + room.name + '</span> <a href="/">Leave</a>');
        $('#roomWatcherName').html('Watcher: <span class="badge badge-success">' + user.name + '</span>');
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

    /* Subscribe observers */

    window.subjects.youJoinedToRoom.subscribe(new YouJoinedToRoomObserver());
    window.subjects.youReConnectedToRoom.subscribe(new YouReConnectedToRoomObserver());

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