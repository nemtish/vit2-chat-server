class Handler {
    constructor(handlers) {
        this.handlers = handlers;
    }

    handle(message) {
        if (!this.handlers[message.type]) {
            throw new Error(`No handler for ${message.type} assigned`);
        } else {
            return new Promise((resolve, reject) => resolve(this.handlers[message.type].handle(message)));
        }
    }
}

module.exports = Handler;
