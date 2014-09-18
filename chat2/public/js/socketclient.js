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
	    //socket.emit("kickuser" , 'hardy');
    }

    self.setResponseListeners = function(socket) {
        socket.on('welcome', function(data) {
	    // Get list of online users
	    socket.emit("onlineUsers");
            self.vent.trigger("loginDone", data);
        });
	socket.on('loginNameExists', function(data) {
	    self.vent.trigger("loginNameExists", data);
	});
	socket.on('loginNameBad', function(data) {
	    self.vent.trigger("loginNameBad", data);
	});
	socket.on('onlineUsers', function(data) {
	    console.log(data);
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
	/*
    self.hostname = 'http://' + window.location.host + "/admin";

    self.connect = function() {
        self.socket = io.connect(self.hostname);

        self.setAdminResponseListeners(self.socket);
    }

    self.setAdminResponseListeners = function(socket) {
	socket.on('welcomeadmin', function(data) {
	    // request server info
	    socket.emit("onlineUsers");
	    
            self.vent.trigger("adminLoginDone", data);
        });


	socket.on('userKicked', function(data) {
	    self.vent.trigger("userKicked", data);
	});
   }
	*/
}
