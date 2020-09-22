const { Subject } = require('rxjs');
const projectDependencies = require('../config/projectDependencies');

module.exports = class Subscriber {
    constructor(subscribers) {
        const { eventBus } = projectDependencies;

        for (let type in subscribers) {
            const sub = subscribers[type];
            eventBus[type] = new Subject();
            eventBus[type].subscribe(message => {
                sub.subscribe(message);
            });
        }
    }
}
