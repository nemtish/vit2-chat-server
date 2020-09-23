class ChatMessageAdded {
    constructor ({ DatabaseService, Socket, eventBus, SlackService }) {

        this.socket = Socket;
        this.slackService = SlackService;
        this.eventBus = eventBus;
        this.userRepository = DatabaseService.userRepository;
    }

    async subscribe(message) {
        const dashboardNsp = this.socket.io.of(message.dashboardUrl);

        if (message.fromSlack) {
            const nsp = this.socket.io.of(message.chatUrl);
            nsp.to(message.payload.socketId).emit('message', message);
            dashboardNsp.emit('message', message);
        }

        if (message.target) {
            this.socket.io.of('/vitamin2').to(message.target).emit('admin_message', message);
        } else {
            dashboardNsp.emit('message', message);
            this.slackService.postMessage(message.payload.user, message.payload.text);
        }
    }
}

module.exports = ChatMessageAdded;
