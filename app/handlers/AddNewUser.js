class AddNewUser {
    constructor (users, eventBus) {
        this.users = users;
        this.eventBus = eventBus;
    }

    async handle(message) {
        // code
        const user = {};
        user.name = message.payload.user;
        user.namespace = 1;
        user.socketId = message.socketId;
        user.messages = [];
        const newUser = await this.users.add(user);
        const text = `${user.name} joined. IP (${message.payload.address}), HOST (${message.payload.host})`;

        this.eventBus[message.type].next({
            ...message,
            type: "user_added",
            payload: {
                text: text,
                user: newUser,
            }
        });
    }
}

AddNewUser.TYPE = 'new_user';

module.exports = AddNewUser;
