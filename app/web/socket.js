const io = require('socket.io');

module.exports = class Socket {

    init(server) {
        this.io = io(server);
    }

    listen(name, controller) {
        controller.handle(name);
    }
}

// exports.start = (io) => {

//     // chat on dashboard
//     const adminNamespace = io.of('/admin');

//     const handlers = new Handler({
//         [NewUserHandler.TYPE]: new NewUserHandler(users),
//         // [UserHandler.USER_MESSAGE]: new UserHandler(),
//         // [UserHandler.USER_DISCONNECTED]: new UserHandler(),
//         [NamespaceService.GET_NAMESPACES]: NamespaceService.all(),
//     });


//     // chat on vitamin2 site
//     const vit2Namespace = io.of('/vitamin2');
//     vit2Namespace.on('connection', socket => {
//         socket.on('message', message => {

//             handlers.handle({
//                 ...message,
//                 socketId: socket.id,
//             });
//             // emit to dashboard chat
//             adminNamespace.emit('message', {
//                 ...message,
//                 socketId: socket.id
//             });
//         });
//     });

//     adminNamespace.on('connection', socket => {
//         socket.on('message', (message, cb) => {
//             cb(handlers[message.type]);
//         });
//     })
// };

// exports.getOnlineUsers = () => Object.values(chatUsers);
