class UserLeft {
    constructor ({ userRepository, namespaceRepository }, eventBus) {
        this.users = userRepository;
        this.namespaces = namespaceRepository;
        this.eventBus = eventBus;
    }

    async handle(message) {
        if (message.payload.user) {
            const user = await this.users.getByName(message.payload.user);
            if (user) {
                await this.users.remove(user.id);
                this.eventBus[message.type].next({
                    ...message,
                    type: "user_removed",
                    payload: {
                        user: user.name,
                    }
                });
            }
        }
    }
}

UserLeft.TYPE = 'user_left';
module.exports = UserLeft;
