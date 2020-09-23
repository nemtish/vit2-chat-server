const io = require('socket.io');

module.exports = class Socket {

    init(server) {
        this.io = io(server);
    }

    listen(name, controller) {
        controller.handle(name);
    }
}
