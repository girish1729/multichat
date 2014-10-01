var ChatClient = function(options) {
    var self = this;

    self.vent = options.vent;
    self.hostname = 'http://' + window.location.host;
    self.connect = function() {
        self.socket = io.connect(self.hostname);
        self.setResponseListeners(self.socket);
    }

    self.login = function(name) {
	self.socket.emit("login", name);
    }
    self.chat = function(chat) {
	self.socket.emit("chat", chat);
    }
    self.kickuser = function(name) {
	self.socket.emit("kickuser", name);
    }



    self.setResponseListeners = function(socket) {
        socket.on('welcome', function(data) {
            self.vent.trigger("loginDone", data);
        });
	 socket.on('adminlogin', function(data) {
	    // Get list of online users
	    socket.emit("onlineUsers");
            self.vent.trigger("adminloginDone", data);
        });

	socket.on('loginNameExists', function(data) {
	    self.vent.trigger("loginNameExists", data);
	});
	socket.on('loginNameBad', function(data) {
	    self.vent.trigger("loginNameBad", data);
	});
	socket.on('onlineUsers', function(data) {
	    self.vent.trigger("usersInfo", data);
	});
	socket.on('userJoined', function(data) {
	    self.vent.trigger("userJoined", data);
	});
	socket.on('userLeft', function(data) {
	    self.vent.trigger("userLeft", data);
	});
	socket.on('chat', function(data) {
	    self.vent.trigger("chatReceived", data);
	});
	socket.on('userKicked', function(data) {
	    self.vent.trigger("userKicked", data);
	});
    }
}
