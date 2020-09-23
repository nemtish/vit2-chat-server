const Handler = require('../handlers/Handler');
const AddNewUser = require('../handlers/AddNewUser');
const ChatMessage = require('../handlers/ChatMessage');
const UserLeft = require('../handlers/UserLeft');
const Subscriber = require('../subscribers/Subscriber');
const UserAdded = require('../subscribers/UserAdded');
const ChatMessageAdded = require('../subscribers/ChatMessageAdded');
const UserRemoved = require('../subscribers/UserRemoved');

module.exports = class ChatController {
    constructor(deps) {
        const { DatabaseService, eventBus, Socket } = deps;

        this.socket = Socket;
        this.eventBus = eventBus;
        this.DatabaseService = DatabaseService;
        this.namespaceRepository = DatabaseService.namespaceRepository;

        this.subscriber = new Subscriber({
            [AddNewUser.TYPE]: new UserAdded(deps),
            [ChatMessage.TYPE]: new ChatMessageAdded(deps),
            [UserLeft.TYPE]: new UserRemoved(deps)
        });

        this.handlers = new Handler({
            [AddNewUser.TYPE]: new AddNewUser(DatabaseService.userRepository, eventBus),
            [ChatMessage.TYPE]: new ChatMessage(DatabaseService.userRepository, eventBus)
        });

    }

    listen(namespaceName) {
        this.namespaceRepository.getByName(namespaceName)
            .then(namespace => {
                const nsp = this.socket.io.of(namespace.url);
                nsp.on('connection', socket => {
                    socket.on('message', message => {
                        if (message.type === AddNewUser.TYPE) {
                            socket.user = message.payload.user;
                        }

                        this.handlers.handle({
                            ...message,
                            dashboardUrl: namespace.admin_url,
                            socketId: socket.id
                        });
                    });

                    socket.on('disconnect', () => {
                        const handler = new UserLeft(this.DatabaseService, this.eventBus);
                        handler.handle({
                            type: 'user_left',
                            dashboardUrl: namespace.admin_url,
                            payload: {
                                user: socket.user,
                            }
                        });
                    });
                });
            });
    };
}
