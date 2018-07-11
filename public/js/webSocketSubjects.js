/* Base Subject */

var BaseSubject = function () {
    this._observers = [];
};

BaseSubject.prototype.subscribe = function (observer) {
    this._observers.push(observer);
};


BaseSubject.prototype.unsubscribe = function (observer) {
    var index = this._observers.indexOf(observer);
    if (index > -1) this._observers.slice(index);
};

BaseSubject.prototype.publish = function (res) {
    this._observers.forEach(function (o) {
        o.notify(res);
    });
};

/* You Joined To Room Subject */

var YouJoinedToRoomSubject = function () {
    Object.getPrototypeOf(YouJoinedToRoomSubject.prototype).constructor.call(this);
};

YouJoinedToRoomSubject.prototype = Object.create(BaseSubject.prototype);

/* You Re-Connected To Room  */

var YouReConnectedToRoomSubject = function () {
    Object.getPrototypeOf(YouReConnectedToRoomSubject.prototype).constructor.call(this);
};

YouReConnectedToRoomSubject.prototype = Object.create(BaseSubject.prototype);

/* You Left Room */

var YouLeftRoomSubject = function () {
    Object.getPrototypeOf(YouLeftRoomSubject.prototype).constructor.call(this);
};

YouLeftRoomSubject.prototype = Object.create(BaseSubject.prototype);

/* User Joined To Room */

var UserJoinedToRoomSubject = function () {
    Object.getPrototypeOf(UserJoinedToRoomSubject.prototype).constructor.call(this);
};

UserJoinedToRoomSubject.prototype = Object.create(BaseSubject.prototype);

/* User Re-Connected To Room */

var UserReConnectedToRoomSubject = function() {
    Object.getPrototypeOf(UserReConnectedToRoomSubject.prototype).constructor.call(this);
};

UserReConnectedToRoomSubject.prototype = Object.create(BaseSubject.prototype);

/* User Left Room */

var UserLeftRoomSubject = function() {
    Object.getPrototypeOf(UserLeftRoomSubject.prototype).constructor.call(this);
};

UserLeftRoomSubject.prototype = Object.create(BaseSubject.prototype);

/* Export subjects */

window.subjects = {
    youJoinedToRoom: new YouJoinedToRoomSubject(),
    youReConnectedToRoom: new YouReConnectedToRoomSubject(),
    youLeftRoom: new YouLeftRoomSubject(),
    userReConnectedToRoom: new UserReConnectedToRoomSubject(),
    userJoinedToRoom: new UserJoinedToRoomSubject(),
    userLeftRoom: new UserLeftRoomSubject()
};