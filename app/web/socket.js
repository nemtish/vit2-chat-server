const io = require('socket.io');

module.exports = class Socket {

    init(server) {
        this.io = io(server);
        this.io.origins('*:*');
    }

    listen(name, controller) {
        controller.handle(name);
    }
}
