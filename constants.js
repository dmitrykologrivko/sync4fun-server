module.exports.events = {
    CONNECT: 'connect',
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',

    JOIN_USER_TO_ROOM: 'join_user_to_room',
    YOU_JOINED_ROOM: 'you_joined_room',
    USER_JOINED_ROOM: 'user_joined_room',
    YOU_RECONNECTED_TO_ROOM: 'you_reconnected_to_room',
    USER_RECONNECTED_TO_ROOM: 'user_reconnected_to_room',
    ERROR_OF_JOINING_USER_TO_ROOM: 'error_of_joining_user_to_room',

    LEAVE_USER_FROM_ROOM: 'leave_user_from_room',
    YOU_LEFT_ROOM: 'you_left_room',
    USER_LEFT_ROOM: 'user_left_room',
    ERROR_OF_LEAVING_USER_FROM_ROOM: 'error_of_leaving_user_from_room',

    CHANGE_PLAY_STATE_TO_PLAY: 'change_play_state_to_play',
    CHANGED_PLAY_STATE_TO_PLAY: 'changed_play_state_to_play',
    ERROR_OF_CHANGING_PLAY_STATE_TO_PLAY: 'error_of_changing_play_state_to_play',

    CHANGE_PLAY_STATE_TO_PAUSE: 'change_play_state_to_pause',
    CHANGED_PLAY_STATE_TO_PAUSE: 'changed_play_state_to_pause',
    ERROR_OF_CHANGING_PLAY_STATE_TO_PAUSE: 'error_of_changing_play_state_to_pause',

    CHANGE_PLAY_STATE_TO_STOP: 'change_play_state_to_stop',
    CHANGED_PLAY_STATE_TO_STOP: 'changed_play_state_to_stop',
    ERROR_OF_CHANGING_PLAY_STATE_TO_STOP: 'error_of_changing_play_state_to_stop',

    CHANGE_PLAY_STATE_TIME: 'change_play_state_time',
    CHANGED_PLAY_STATE_TIME: 'changed_play_state_time',
    ERROR_OF_CHANGING_PLAY_STATE_TIME: 'error_of_changing_play_state_time',
};
