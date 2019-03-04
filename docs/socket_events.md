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
| ---------------|:-------:| -----------------------------:| --------:|
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

## change_play_state_to_play

This event allows setting play state to play for all users in the room

Request body must be empty

#### Case 1 - The user in the room and is trying to set play state to play

Response to the room `changed_play_state_to_play`

```
{
   "user":{
      "id":"qqffsfs8938dffsbdwwt",
      "name":"John"
   }
}
```

#### Case 2 - The user is trying to set play state to play but is not in any room

Response to user `error_of_changing_play_state_to_play`

```
{
   "message":"You are not in any of the rooms"
}
```

## change_play_state_to_pause

This event allows setting play state to pause for all users in the room

Request body must be empty

#### Case 1 - The user in the room and is trying to set play state to pause

Response to the room `changed_play_state_to_pause`

```
{
   "user":{
      "id":"qqffsfs8938dffsbdwwt",
      "name":"John"
   }
}
```

#### Case 2 - The user is trying to set play state to pause but is not in any room

Response to user `error_of_changing_play_state_to_pause`

```
{
   "message":"You are not in any of the rooms"
}
```

## change_play_state_to_stop

This event allows setting play state to stop for all users in the room

Request body must be empty

#### Case 1 - The user in the room and is trying to set play state to stop

Response to the room `changed_play_state_to_stop`

```
{
   "user":{
      "id":"qqffsfs8938dffsbdwwt",
      "name":"John"
   }
}
```

#### Case 2 - The user is trying to set play state to stop but is not in any room

Response to user `error_of_changing_play_state_to_stop`

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
