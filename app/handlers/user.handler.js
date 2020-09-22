class UserHandler {
    constructor (users) {
        this.users = users;
    }

    handle(message) {
        switch(message.type) {
            case this.NEW_USER:
                const user = message.payload.username;
                this.users.add(user);
                break;
            case this.REMOVE_USER:
                const user = message.payload.userId;
                this.users.remove(user);
                break;
        }
        // code
        // const message = `${user} joined. IP (${message.payload.address}), HOST (${message.payload.host})`;
    }
}

UserHandler.NEW_USER = 'new_user';
UserHandler.REMOVE_USER = 'remove_user';

module.exports = NewUserHandler;
