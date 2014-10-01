var ContainerView = Backbone.View.extend({
    el: '#container',

    initialize: function (options) {
        this.model.on("change:viewState", this.render, this);
    },
    render: function () {
        var view = this.model.get('viewState');
        this.$el.html(view.render()
            .el);
    }
});

var LoginView = Backbone.View.extend({
    template: _.template($('#login-template')
        .html()),
    events: {
        'click #nameBtn': 'onLogin'
    },

    initialize: function (options) {
        this.vent = options.vent;
        this.listenTo(this.model, "change:error", this.render, this);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        if (!this.l) {
            this.l = Ladda.create(this.$("#nameBtn")
                .get(0));
        } else {
            this.l.stop();
        }
        return this;
    },

    onLogin: function () {
        this.l.start();
        this.vent.trigger("login", this.$('#nameText')
            .val());
    }
});

var HomeView = Backbone.View.extend({
    template: _.template($("#home-template")
        .html()),
    events: {
        'keypress #chatInput': 'chatInputPressed',
        'mousedown #chatButton': 'mouseInputPressed'
    },

    initialize: function (options) {
        this.vent = options.vent;
        var onlineUsers = this.model.get('onlineUsers');
        var userChats = this.model.get('userChats');

        this.listenTo(onlineUsers, "add", this.renderUser, this);
        this.listenTo(onlineUsers, "remove", this.renderUsers, this);
        this.listenTo(onlineUsers, "reset", this.renderUsers, this);

        this.listenTo(userChats, "add", this.renderChat, this);
        this.listenTo(userChats, "remove", this.renderChats, this);
        this.listenTo(userChats, "reset", this.renderChats, this);
    },
    render: function () {
        var onlineUsers = this.model.get("onlineUsers");
        this.$el.html(this.template());
        this.renderUsers();
        this.renderChats();
        return this;
    },
    renderUsers: function () {
        this.$('#userList')
            .empty();
        this.model.get("onlineUsers")
            .each(function (user) {
                this.renderUser(user);
            }, this);
    },
    renderUser: function (model) {
        var template = _.template("<a class='list-group-item'><%= name %></a>");
        this.$('#userList')
            .append(template(model.toJSON()));
        this.$('#userCount')
            .html(this.model.get("onlineUsers")
                .length);
        this.$('.nano')
            .nanoScroller();
    },
    renderChats: function () {
        this.$('#chatList')
            .empty();
        this.model.get('userChats')
            .each(function (chat) {
                this.renderChat(chat);
            }, this);
    },
    renderChat: function (model) {
        var template = _.template("<a class='list-group-item'>" 
	+ "<img class='avatar' src=\"images/avatars/" +
          "<%= avatar %>.png\" />" + 
	"<span class='text-info chatname'><%= sender %></span>" +
           "<span class='msgbox <%= color %>'> <%= message %></a></span>");
        var element = $(template(model.toJSON()));
        element.appendTo(this.$('#chatList'))
            .hide()
            .fadeIn()
            .slideDown();
        this.$('.nano')
            .nanoScroller();
        this.$('.nano')
            .nanoScroller({
                scroll: 'bottom'
            });
    },


    // events
    chatInputPressed: function (evt) {
        if (evt.keyCode == 13) {
            this.vent.trigger("chat", this.$('#chatInput')
                .val());
            this.$('#chatInput')
                .val('');
            return false;
        }
    },
    mouseInputPressed: function (evt) {
        this.vent.trigger("chat", this.$('#chatInput')
            .val());
        this.$('#chatInput')
            .val('');
        return false;
    }

});


var KickView = Backbone.View.extend({
    template: _.template($("#kick-template")
        .html()),
    events: {
        'mousedown #kickButton': 'kickUser'
    },

    initialize: function (options) {
        this.vent = options.vent;
        var onlineUsers = this.model.get('onlineUsers');

        this.listenTo(onlineUsers, "add", this.renderUser, this);
        this.listenTo(onlineUsers, "remove", this.renderUsers, this);
        this.listenTo(onlineUsers, "reset", this.renderUsers, this);
    },
    render: function () {
        var onlineUsers = this.model.get("onlineUsers");
        this.$el.html(this.template());
        this.renderUsers();
        return this;
    },
    renderUsers: function () {
        this.$('#userList')
            .empty();
        this.model.get("onlineUsers")
            .each(function (user) {
                this.renderUser(user);
            }, this);
    },
    renderUser: function (model) {
        var template = _.template("<a class='list-group-item'>" +
            "<%= name %> &nbsp;&nbsp;<input type='checkbox' value=<%= name %> /></a>");
        this.$('#userList')
            .append(template(model.toJSON()));
        this.$('#userCount')
            .html(this.model.get("onlineUsers")
                .length);
        this.$('.nano')
            .nanoScroller();
    },
    // events
    kickUser: function (evt, model) {
        kicku = [];
        this.$(':checkbox:checked')
            .each(function () {
                kicku.push($(this)
                    .val());
            });
        for (var i = 0; i < kicku.length; i++) {
            this.vent.trigger("kickuser", kicku[i]);
        }

        return false;
    }
});
