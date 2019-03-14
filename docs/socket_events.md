# Socket events

This document describes server-side socket events. You can see here a list of available events to requests 
and possible cases of handling request on the server-side.

## join_user_to_room

This event allows joining a user to the room.

Request:

```
{
   "user":{
      "name":"John",
      "file":{
        "name":"rabbit.mp4",
        "size":145899989
      }
   },
   "room":{
      "name":"My room"
   }
}
```

| Field          | Type    | Description                   | Required |
| ---------------|---------| ------------------------------| ---------|
| user.name      | string  | User name                     | yes      |
| user.file.name | string  | File name plus file extension | yes      |
| user.file.size | integer | File size in kilobytes        | yes      |
| room.name      | string  | Room name                     | yes      |

#### Case 1 - New user tries to join the room

Response to user `you_joined_room`

```
{
   "user":{
      "id":"qqffsfs8938dffsbdwwt",
      "name":"John",
      "file":{
         "name":"rabbit.mp4",
         "size":145899989
      }
   },
   "room":{
      "name":"My room",
      "playState": "pause",
      "currentTime": 207.141845,
      "updatedAt": 1552039787472,
      "updatedBy":{
         "id":"fgwsvs674gf8dh2y47gh",
         "name":"Kate"
      }, 
      "users":[
         {
            "id":"qqffsfs8938dffsbdwwt",
            "name":"John",
            "file":{
               "name":"rabbit.mp4",
               "size":145899989
            }
         },
         {
            "id":"fgwsvs674gf8dh2y47gh",
            "name":"Kate",
            "file":{
               "name":"rabbit.mp4",
               "size":145899989
            }
         }
      ]
   }
}
```

Response to the room `user_joined_room`

```
{
   "user":{
      "id":"qqffsfs8938dffsbdwwt",
      "name":"John",
      "file":{
         "name":"rabbit.mp4",
         "size":145899989
      }
   }
}
```

#### Case 2 - The user uses this room already and tries to join again

Response to user `you_reconnected_to_room`

```
{
   "user":{
      "id":"qqffsfs8938dffsbdwwt",
      "name":"John",
      "file":{
         "name":"rabbit.mp4",
         "size":145899989
      }
   },
   "room":{
      "name":"My room",
      "playState": "pause",
      "currentTime": 207.141845,
      "updatedAt": 1552039787472,
      "updatedBy":{
         "id":"fgwsvs674gf8dh2y47gh",
         "name":"Kate"
      }, 
      "users":[
         {
            "id":"qqffsfs8938dffsbdwwt",
            "name":"John",
            "file":{
               "name":"rabbit.mp4",
               "size":145899989
            }
         },
         {
            "id":"fgwsvs674gf8dh2y47gh",
            "name":"Kate",
            "file":{
               "name":"rabbit.mp4",
               "size":145899989
            }
         }
      ]
   }
}
```

Response to the room `user_reconnected_to_room`

```
{
   "user":{
      "id":"qqffsfs8938dffsbdwwt",
      "name":"John",
      "file":{
         "name":"rabbit.mp4",
         "size":145899989
      }
   }
}
```

#### Case 3 - The user uses another room but tries to join another one

Response to user `you_joined_room`

```
{
   "user":{
      "id":"qqffsfs8938dffsbdwwt",
      "name":"John",
      "file":{
         "name":"rabbit.mp4",
         "size":145899989
      }
   },
   "room":{
      "name":"My room",
      "playState": "pause",
      "currentTime": 207.141845,
      "updatedAt": 1552039787472,
      "updatedBy":{
         "id":"fgwsvs674gf8dh2y47gh",
         "name":"Kate"
      }, 
      "users":[
         {
            "id":"qqffsfs8938dffsbdwwt",
            "name":"John",
            "file":{
               "name":"rabbit.mp4",
               "size":145899989
            }
         },
         {
            "id":"fgwsvs674gf8dh2y47gh",
            "name":"Kate",
            "file":{
               "name":"rabbit.mp4",
               "size":145899989
            }
         }
      ]
   }
}
```

Response to the previous room `user_left_room`

```
{
   "user":{
      "id":"qqffsfs8938dffsbdwwt",
      "name":"John"
   }
}
```

Response to the new room `user_joined_room`

```
{
   "user":{
      "id":"qqffsfs8938dffsbdwwt",
      "name":"John",
      "file":{
         "name":"rabbit.mp4",
         "size":145899989
      }
   }
}
```

#### Case 4 - The user is passing invalid request

Response to user `error_of_joining_user_to_room`

```
{
   "message":"Validation error",
   "fields":{
      "room.name": [
         "Room name must be of type string"
      ],
   }
}
```

## leave_user_from_room

This event allows leaving user from current room

Request body must be empty

#### Case 1 - The user is trying to leave room

Response to user `you_left_room`

```
{}
```

Response to the room `user_left_room`

```
{
   "user":{
      "id":"qqffsfs8938dffsbdwwt",
      "name":"John"
   }
}

```

#### Case 2 - The user is trying to leave the room but was not in it

Response to user `error_of_leaving_user_from_room`

```
{
   "message":"You are not in any of the rooms"
}
```

## change_play_state

This event allows changing play state for all users in the room

| Field       | Type    | Description                                               | Required |
| ------------|---------| ----------------------------------------------------------| ---------|
| playState   | string  | Current Play State                                        | yes      |
| currentTime | number  | Current video time                                        | yes      |
| seek        | boolean | If player should do seek                                  | no       |
| sync        | boolean | Save current state without notify other users in the room | no       |

Available play states:
- playing
- pause
- stop

#### Case 1 - The user in the room and is trying to change play state to playing

Request:

```
{
   "playState": "playing",
   "currentTime": 207.141845,
   "seek": false
}
```

Response to the room `changed_play_state`

```
{
   "playState": "playing",
   "currentTime": 207.141845,
   "updatedBy":{
      "id":"qqffsfs8938dffsbdwwt",
      "name":"John"
   }    
   "seek": false
}
```

#### Case 2 - The user in the room and is trying to change play state to pause

Request:

```
{
   "playState": "pause",
   "currentTime": 207.141845,
   "seek": false
}
```

Response to the room `changed_play_state`

```
{
   "playState": "pause",
   "currentTime": 207.141845,
   "updatedBy":{
      "id":"qqffsfs8938dffsbdwwt",
      "name":"John"
   }    
   "seek": false
}
```

#### Case 3 - The user in the room and is trying to change play state to stop

Request:

```
{
   "playState": "stop",
   "currentTime": 207.141845,
   "seek": false
}
```

Response to the room `changed_play_state`

```
{
   "playState": "stop",
   "currentTime": 207.141845,
   "updatedBy":{
      "id":"qqffsfs8938dffsbdwwt",
      "name":"John"
   }      
   "seek": false
}
```

#### Case 4 - The user in the room and is trying to change current time

Request:

```
{
   "playState": "playing",
   "currentTime": 207.141845,
   "seek": true
}
```

Response to the room `changed_play_state`

```
{
   "playState": "playing",
   "currentTime": 207.141845,
   "updatedBy":{
      "id":"qqffsfs8938dffsbdwwt",
      "name":"John"
   }   
   "seek": true
}
```

#### Case 5 - The user in the room and video ended

Request:

```
{
   "playState": "pause",
   "currentTime": 207.141845,
   "sync": true
}
```

#### Case 6 - The user is passing invalid request

Response to user `error_of_changing_play_state`

```
{
   "message":"Validation error",
   "fields":{
      "currentTime": [
         "Current Time must be of type number"
      ],
   }
}
```

#### Case 7 - The user is trying to change play state but is not in any room

Response to user `error_of_changing_play_state`

```
{
   "message":"You are not in any of the rooms"
}
```

## send_message_to_room

This event allows sending message for all users in the room

| Field   | Type   | Description  | Required |
| --------|--------| -------------| ---------|
| message | string | Message      | yes      |

#### Case 1 - The user in the room and is trying to send message

Request:

```
{
   "message": "Hi there!"
}
```

Response to the room `sent_message_to_room`

```
{
   "message": "Hi there!"
   "sender":{
      "id":"qqffsfs8938dffsbdwwt",
      "name":"John"
   }
}
```

#### Case 2 - The user is passing invalid request

Response to user `error_of_sending_message_to_room`

```
{
   "message":"Validation error",
   "fields":{
      "message": [
         "Message must be of type string"
      ],
   }
}
```

#### Case 3 - The user is trying to send message but is not in any room

Response to user `error_of_sending_message_to_room`

```
{
   "message":"You are not in any of the rooms"
}
```

## disconnect

This automatic event happens when user closed socket connection

#### Case 1 - The user was in any group

Response to the room `user_left_room`

```
{
   "user":{
      "id":"qqffsfs8938dffsbdwwt",
      "name":"John"
   }
}

```

#### Case 2 - The user was not in any group

Nothing extra response to anyone
