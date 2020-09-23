const InMemoryDBService = require('../persistence/InMemoryDBService');
const Socket = require('../web/socket');
const SlackService = require('../SlackService');

module.exports = (() => {
    const databaseService = new InMemoryDBService();

    return {
        DatabaseService: databaseService,
        Socket: new Socket(),
        SlackService: new SlackService(databaseService.userRepository),
        eventBus: []
    }
})();
