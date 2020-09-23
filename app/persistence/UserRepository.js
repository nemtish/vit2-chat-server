module.exports = class UserRepository {
    constructor() {
        this.users = [];
        this.currentId = 0;
    }

    async add(user) {
        try {
            this.currentId++;
            user.id = this.currentId;
            this.users.push(user);
        } catch (e) {
            throw new Error('Error Occurred when adding user');
        }

        return user;
    }

    async update(userId, data) {
        let newUser;
        try {
            const userIndex = this.users.findIndex(u => u.id === userId);
            const oldUser = this.users[userIndex];
            const newUser = Object.assign({}, oldUser, data);
            this.users[userIndex] = newUser;
        } catch(e) {
            throw new Error('Error Occurred when updating user');
        }

        return newUser;
    }

    async remove(userId) {
        try {
            const userIndex = this.users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                this.users.splice(userIndex, 1);
            }
        } catch(e) {
            throw new Error('Error Occurred when removing user');
        }

        return true;
    }

    async getByNamespaceId(namespaceId) {
        let users;
        try {
            users = this.users.filter(u => u.namespace === namespaceId);
        } catch (e) {
            throw new Error('Error Occurred when finding user by ID');
        }
        return users;
    }

    async getByName(username) {
        let user;
        try {
            user = this.users.find(u => u.name === username);
        } catch (e) {
            throw new Error('Error Occurred when finding user by ID');
        }
        return user;
    }

    async getByConversationId(conversationId) {
        let user;
        try {
            user = this.users.find(u => u.conversationId === conversationId);
        } catch (e) {
            throw new Error('Error Occurred when finding user by ID');
        }
        return user;
    }
}
