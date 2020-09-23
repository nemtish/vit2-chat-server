const { WebClient } = require('@slack/web-api');
const { randomString } = require('../utils');

class UserAdded {
    constructor ({ Socket, eventBus, SlackService }) {
        this.socket = Socket;
        this.eventBus = eventBus;
        this.slackService = SlackService;
    }

    subscribe(message) {
        const dashboardNsp = this.socket.io.of(message.dashboardUrl);
        dashboardNsp.emit('message', message);
        this.slackService.createConversation(message.payload.user);
    }
}

module.exports = UserAdded;
