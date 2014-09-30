_ = require('underscore');

avatartbl = {
	'foo': { 'role' : 'user', 'avatar' : 'woman', 'color' : 'red'},
	'bar' : {'role' : 'user', 'avatar' : 'user54', 'color' : 'orange'},
	'bhavna' : {'role' : 'user', 'avatar' : 'teenage', 'color' : 'green'},
	'smile' : {'role' : 'user' , 'avatar' : 'smiling43', 'color' : 'black'},
	'boss' : {'role' : 'admin', 'avatar' : 'admin', 'color' : 'admin'},
};


function lookupavatar(user) {
        if(avatartbl[user] === undefined) {
                return {'role' : 'user', 'avatar' : 'default', 'color' : 'blue'};
        } else {
                return avatartbl[user];
        }
}

var Server = function (options) {
    var self = this;
    self.io = options.io;
    self.users = [];
    self.init = function () {
        // Fired upon a connection
        self.io.on("connection", function (socket) {
                self.handleConnection(socket);
            });
    }
    self.handleConnection = function (socket) {
        // wait for a login
        socket.on('login', function (username) {
            var nameBad = !username || username.length < 3 || username.length > 10;
            if (nameBad) {
                socket.emit('loginNameBad', username);
                return;
            }
            var nameExists = _.some(self.users, function (item) {
                return item.user == username;
            });
            if (nameExists) {
                socket.emit("loginNameExists", username);
            } else {
                var newUser = new User({
                    user: username,
	            socket: socket
                });
		var avatar = lookupavatar(username);

                self.users.push(newUser);
                self.setResponseListeners(newUser);

		if(avatar.role == 'admin') {
                	socket.emit("adminlogin");
		} else {
                	socket.emit("welcome");
		}

		console.log(newUser.socket.id);
		console.log(avatar.avatar);
		console.log(avatar.color);
		sendstr = newUser.user + "," + 
			 avatar.avatar + "," +  avatar.color;
                self.io.sockets.emit("userJoined", sendstr);
            }
        });
            }

    self.setResponseListeners = function (user) {
        user.socket.on('disconnect', function () {
            self.users.splice(self.users.indexOf(user), 1);
		var avatar = lookupavatar(user);
		sendstr = user + "," + 
			 avatar.avatar + "," +  avatar.color;
            self.io.sockets.emit("userLeft", sendstr);
        });

        user.socket.on("onlineUsers", function () {
            var users = _.map(self.users, function (item) {
                return item.user;
            });
            user.socket.emit("onlineUsers", users);
        });

	user.socket.on('kickuser', function (username) {
            self.users.splice(self.users.indexOf(username), 1);
		var avatar = lookupavatar(username);
		sendstr = username + "," + 
			 avatar.avatar + "," +  avatar.color;
            self.io.sockets.emit("userKicked", sendstr);
        });


        user.socket.on("chat", function (chat) {
            if (chat) {
                self.io.sockets.emit("chat", {
                    sender: user.user,
                    avatar: lookupavatar(user.user).avatar,
                    color: lookupavatar(user.user).color,
                    message: ': ' + chat
                });
            }
        });
   }
}

// User Model
var User = function (args) {
    var self = this;

    self.socket = args.socket;
    self.user = args.user;
}
module.exports = Server;
