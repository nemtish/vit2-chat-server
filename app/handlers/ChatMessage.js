class ChatMessage {
    constructor (users, eventBus) {
        this.users = users;
        this.eventBus = eventBus;
    }

    async handle(message) {
        const user = await this.users.getByName(message.payload.user)
        user.messages.push(message.payload.text);

        this.eventBus[message.type].next({
            ...message,
            type: 'user_message_added',
            payload: {
                user: user,
                text: message.payload.text,
                date: message.payload.date
            }
        });
    }
}

ChatMessage.TYPE = 'chat_message';
module.exports = ChatMessage;
