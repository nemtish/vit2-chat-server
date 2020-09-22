class UserRemoved {
    constructor ({ Socket, eventBus }) {
        this.socket = Socket;
        this.eventBus = eventBus;
    }

    subscribe(message) {
        const dashboardNsp = this.socket.io.of(message.dashboardUrl);
        dashboardNsp.emit('message', message);
    }
}

module.exports = UserRemoved;
