const chatUsers = {};

exports.listen = (socket) => {

    socket.on('GET_USERS', (_, cb) => {
        cb(this.getOnlineUsers());
    });

    // socket.on('GET_USERS', () => {
    //     socket.emit('users', this.getOnlineUsers());
    // });

    socket.on('new-user', (user) => {
        chatUsers[socket.id] = user;
        socket.broadcast.emit('new-user', user);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-left', chatUsers[socket.id]);
        delete chatUsers[socket.id];
    });

    socket.on('new-message', (data) => {
        socket.broadcast.emit('new-message', data);
    });

    socket.on('typing', (user) => {
        socket.broadcast.emit('typing', user);
    });

    socket.on('stop-typing', (user) => {
        socket.broadcast.emit('stop-typing', user);
    });
};

exports.getOnlineUsers = () => Object.values(chatUsers);
