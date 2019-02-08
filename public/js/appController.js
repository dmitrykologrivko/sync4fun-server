$(function () {

    /* Module variables */

    var client = window.webSocketClient;

    /* Module functions */

    function updateRoomInformation(user, room, file) {
        $('#roomTitle').html('Room: <span class="badge badge-success">' + room.name + '</span> <a id="leaveRoom" href="/">Leave</a>');
        $('#roomWatcherName').html('Watcher: <span class="badge badge-success">' + user.name + '</span>');
        $('#roomWatcherFile').html('File: <span class="badge badge-success">' + file.name +'</span>');

        // setup leave room click
        $('#leaveRoom').click(function () {
            client.leaveRoom();
        });
    }

    function updateVideoPlayer(url) {
        $('#videoPlayer').attr("src", url);
    }

    function addRoomEvent(user, message) {
        $('.events-list').append('<li><span class="badge badge-info">' + user.name + '</span> ' + message + '</li>');
    }

    // TODO: Make function as module lever
    window.playVideo = function () {
        $('#videoPlayer').trigger('play');
        client.play({room: {name: 'test'}}); // TODO: Change this hardcoded object
    };

    // TODO: Make function as module lever
    window.pauseVideo = function() {
        $('#videoPlayer').trigger('pause');
        client.pause({room: {name: 'test'}}); // TODO: Change this hardcoded object
    };

    // TODO: Make function as module lever
    window.stopVideo = function () {
        $('#videoPlayer').trigger('stop');
        client.stop({room: {name: 'test'}}); // TODO: Change this hardcoded object
    };

    /* Module observers */

    var YouJoinedToRoomObserver = function () {
        return {
            notify(res) {
                $('#joinRoomModal').modal('hide');
                updateRoomInformation(res.user, res.room, res.file);
                addRoomEvent(res.user, 'Connected to room');
            }
        }
    };

    var YouReConnectedToRoomObserver = function () {
        return {
            notify(res) {
                $('#joinRoomModal').modal('hide');
                updateRoomInformation(res.user, res.room, res.file);
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

    var UserChangedPlayStateToPlayObserver = function() {
        return {
            notify(res) {
                $('#videoPlayer').trigger('play');
                addRoomEvent('?', 'Start playing a video');
            }
        }
    };

    var UserChangedPlayStateToPauseObserver = function() {
        return {
            notify(res) {
                $('#videoPlayer').trigger('pause');
                addRoomEvent('?', 'Paused playing a video');
            }
        }
    };

    var UserChangedPlayStateToStopObserver = function() {
        return {
            notify(res) {
                $('#videoPlayer').trigger('stop');
                addRoomEvent('?', 'Stopped playing a video');
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
    window.subjects.userChangedPlayStateToPlay.subscribe(new UserChangedPlayStateToPlayObserver());
    window.subjects.userChangedPlayStateToPause.subscribe(new UserChangedPlayStateToPauseObserver());
    window.subjects.userChangedPlayStateToStop.subscribe(new UserChangedPlayStateToStopObserver());

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // show join to room modal window
    $('#joinRoomModal').modal({
        backdrop: 'static',
        keyboard: false
    });

    // setup join to room click
    $('#joinRoom').click(function () {
        var file = $('#watcher-file')[0].files[0];

        client.joinUserToRoom({
            user: {
                name: $('#watcher-name').val()
            },
            room: {
                name: $('#room-name').val()
            },
            file: {
                name: file.name,
                size: file.size
            }
        });

        updateVideoPlayer(URL.createObjectURL(file));
    });

});