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

    CHANGE_PLAY_STATE: 'change_play_state',
    CHANGED_PLAY_STATE: 'changed_play_state',
    ERROR_OF_CHANGING_PLAY_STATE: 'error_of_changing_play_state',

    SEND_MESSAGE_TO_ROOM: 'send_message_to_room',
    SENT_MESSAGE_TO_ROOM: 'sent_message_to_room',
    ERROR_OF_SENDING_MESSAGE_TO_ROOM: 'error_of_sending_message_to_room'
};

module.exports.playStates = {
    PLAY_STATE_PLAYING: 'playing',
    PLAY_STATE_PAUSE: 'pause',
    PLAY_STATE_STOP: 'stop'
};