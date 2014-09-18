_ = require('underscore');

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
                    socket: socket,
                    id: socket.id
                });

                self.users.push(newUser);
                self.setResponseListeners(newUser);

                socket.emit("welcome");
                self.io.sockets.emit("userJoined", newUser.user);
            }
        });
        socket.on('kickuser', function (username) {
            self.users.splice(self.users.indexOf(username), 1);
		 //self.users.socket.id.disconnect();
            self.io.sockets.emit("userKicked", username);
        });
    }

    self.setResponseListeners = function (user) {
        user.socket.on('disconnect', function () {
            self.users.splice(self.users.indexOf(user), 1);
            self.io.sockets.emit("userLeft", user.user);
        });

        user.socket.on("onlineUsers", function () {
            var users = _.map(self.users, function (item) {
                return item.user;
            });
            user.socket.emit("onlineUsers", users);
        });

        user.socket.on("chat", function (chat) {
            if (chat) {
                self.io.sockets.emit("chat", {
                    sender: user.user,
                    message: ': ' + chat
                });
            }
        });
   }

	/*
    self.io
        .of('/admin')
        .on('connection', function (socket) {
            self.handleAdminConnection(socket);
        });

    self.handleAdminConnection = function (socket) {
        var newUser = new User({
            user: 'admin',
            socket: socket
        });

        self.users.push(newUser);

        self.setAdminResponseListeners(newUser);
    }


    self.setAdminResponseListeners = function (user) {
        user.socket.on('adminkick', function () {
            self.users.splice(self.users.indexOf(user), 1);
            self.io.sockets.emit("userKicked", user.user);
        });


        user.socket.on("onlineUsers", function () {

            var users = _.map(self.users, function (item) {
                return item.user;
            });

            user.socket.emit("onlineUsers", users);
        });


    }
	*/

}

// User Model
var User = function (args) {
    var self = this;

    self.socket = args.socket;
    self.user = args.user;
}
module.exports = Server;
