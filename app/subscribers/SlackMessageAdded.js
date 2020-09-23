class SlackMessageAdded {
    constructor ({ DatabaseService, Socket, eventBus, SlackService }) {

        this.socket = Socket;
        this.slackService = SlackService;
        this.eventBus = eventBus;
        this.userRepository = DatabaseService.userRepository;
    }

    async subscribe(message) {
        const dashboardNsp = this.socket.io.of(message.dashboardUrl);
        const nsp = this.socket.io.of(message.chatUrl);

        nsp.to(message.payload.user.socketId).emit('admin_message', message);
        dashboardNsp.emit('message', message);
    }
}

module.exports = SlackMessageAdded ;
