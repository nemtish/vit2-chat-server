const InMemoryDBService = require('../persistence/InMemoryDBService');
const Socket = require('../web/socket');

module.exports = (() => {
    let socket = null;

    return {
        DatabaseService: new InMemoryDBService(),
        Socket: new Socket(),
        eventBus: []
    }
})();
