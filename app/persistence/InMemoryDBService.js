const NamespaceRepository = require('./NamespaceRepository');
const UserRepository = require('./UserRepository');

module.exports = class InMemoryDBService {
    constructor() {
        this.namespaceRepository = new NamespaceRepository();
        this.userRepository = new UserRepository();
    }

    async initDatabase() {
        // seed db here if needed
        this.namespaceRepository.add({
            name: 'vitamin2',
            url: '/vitamin2',
            admin_url: '/admin'
        });
    }
};
