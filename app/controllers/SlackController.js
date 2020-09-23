const Handler = require('../handlers/Handler');
const SlackMessage = require('../handlers/SlackMessage');
const Subscriber = require('../subscribers/Subscriber');
const SlackMessageAdded = require('../subscribers/SlackMessageAdded');

module.exports = class SlackController {
    constructor(deps) {
        const { DatabaseService, eventBus, Socket } = deps;

        this.socket = Socket;
        this.userRepository = DatabaseService.userRepository;
        this.namespaceRepository = DatabaseService.namespaceRepository;

        this.subscriber = new Subscriber({
            [SlackMessage.TYPE]: new SlackMessageAdded(deps),
        });

        this.handlers = new Handler({
            [SlackMessage.TYPE]: new SlackMessage(this.userRepository, eventBus)
        });
    }

    listen(namespaceName, slackEvents) {
        this.namespaceRepository.getByName(namespaceName)
            .then(namespace => {
                slackEvents.on('message', async (event) => {
                    console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
                    const userObj = await this.userRepository.getByConversationId(event.channel);
                    if (event.client_msg_id && userObj) {
                        const message = {
                            type: 'slack_message',
                            payload: {
                                user: userObj.name,
                                text: event.text,
                            }
                        };

                        this.handlers.handle({
                            ...message,
                            dashboardUrl: namespace.admin_url,
                            chatUrl: namespace.url
                        });
                    }
                });
            });
    };
}
