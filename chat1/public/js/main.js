$(function () {
        var mainController = new MainController();
        mainController.init();
});

var MainController = function () {
    var self = this;

    self.appEventBus = _.extend({}, Backbone.Events);
    self.viewEventBus = _.extend({}, Backbone.Events);
    self.init = function () {
        self.chatClient = new ChatClient({
            vent: self.appEventBus
        });
        self.chatClient.connect();
        self.loginModel = new LoginModel();
        self.kickModel = new KickModel();
        self.homeModel = new HomeModel();

        self.containerModel = new ContainerModel({
            viewState: new LoginView({
                vent: self.viewEventBus,
                model: self.loginModel
            })
        });
        self.containerView = new ContainerView({
            model: self.containerModel
        });
        self.containerView.render();
    }

    self.viewEventBus.on("login", function (name) {
        self.chatClient.login(name);
    });

    self.viewEventBus.on("chat", function (chat) {
        self.chatClient.chat(chat);
    });

    self.viewEventBus.on("kickuser", function (name) {
        self.chatClient.kickuser(name);
    });


    self.appEventBus.on("loginDone", function () {
        self.homeModel = new HomeModel();
        self.homeView = new HomeView({
            vent: self.viewEventBus,
            model: self.homeModel
        });
        self.containerModel.set("viewState", self.homeView);
    });

    self.appEventBus.on("adminloginDone", function () {
        self.kickModel = new KickModel();
	 self.kickView = new KickView({
            vent: self.viewEventBus,
            model: self.kickModel
        });
        self.containerModel.set("viewState", self.kickView);
    });


    self.appEventBus.on("loginNameBad", function (name) {
        self.loginModel.set("error", "Invalid Name");
    });

    self.appEventBus.on("loginNameExists", function (name) {
        self.loginModel.set("error", "Name already exists");
    });

    
    self.appEventBus.on("usersInfo", function (data) {
        var onlineUsers = self.kickModel.get("onlineUsers");
        var users = _.map(data, function (item) {
            return new UserModel({
                name: item
            });
        });
        onlineUsers.reset(users);
    });


    self.appEventBus.on("userJoined", function (data) {
	arr = data.split(',');
        self.kickModel.addUser(arr[0]);
        self.homeModel.addChat({
            sender: "",
            avatar: arr[1],
            color: arr[2],
            message: "<span class='statuson'>" + arr[0]
		+ " joined room.</span>"
        });
    });

    self.appEventBus.on("userLeft", function (data) {
	arr = data.split(',');
        self.kickModel.removeUser(arr[0]);
	console.log("I am leaving " + arr[0]);

        self.homeModel.addChat({
            sender: "",
            avatar: arr[1],
            color: arr[2],
            message: "<span class='statusoff'>" + username + " left room.</span>"
        });
    });

    self.appEventBus.on("userKicked", function (data) {
	arr = data.split(',');
        self.kickModel.removeUser(arr[0]);
	console.log("I am kicking user" + arr[0]);

        self.homeModel.addChat({
            sender: "",
            avatar: arr[1],
            color: arr[2],
            message: "<span class='statusoff'>" + username + " kicked out.</span>"
        });
    });


    self.appEventBus.on("chatReceived", function (chat) {
        self.homeModel.addChat(chat);
    });
}
