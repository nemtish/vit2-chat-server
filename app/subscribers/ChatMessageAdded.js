class ChatMessageAdded {
    constructor ({ Socket, eventBus }) {
        this.socket = Socket;
        this.eventBus = eventBus;
    }

    subscribe(message) {
        const dashboardNsp = this.socket.io.of(message.dashboardUrl);
        if (message.target) {
            this.socket.io.of('/vitamin2').to(message.target).emit('admin_message', message);
        } else {
            dashboardNsp.emit('message', message);
        }
    }
}

module.exports = ChatMessageAdded;
