$(function () {

    var client = window.webSocketClient;

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

    /* Setup observers */

    var YouJoinedToRoomObserver = function () {
        return {
            notify(res) {
                $('#joinRoomModal').modal('hide');
            }
        }
    };

    var YouReConnectedToRoomObserver = function () {
        return {
            notify(res) {
                $('#joinRoomModal').modal('hide');
            }
        }
    };

    /* Subscribe observers */

    window.subjects.youJoinedToRoom.subscribe(new YouJoinedToRoomObserver());
    window.subjects.youReConnectedToRoom.subscribe(new YouReConnectedToRoomObserver());

});