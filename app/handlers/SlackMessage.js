class SlackMessage {
    constructor (users, eventBus) {
        this.users = users;
        this.eventBus = eventBus;
    }

    async handle(message) {
        const user = await this.users.getByName(message.payload.user)
        user.messages.push(message.payload.text);

        this.eventBus[message.type].next({
            ...message,
            type: 'slack_message_added',
            payload: {
                user: user,
                text: message.payload.text,
                date: message.payload.date,
            }
        });
    }
}

SlackMessage.TYPE = 'slack_message';
module.exports = SlackMessage;
