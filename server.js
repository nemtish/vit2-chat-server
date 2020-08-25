'use strict'

const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const socketService = require('./app/socket.service');

require('dotenv').config()

// listen socket connections
// io.on('connection', socketService.listen);

//

const namespaces = {};
const messages = {};

const adminNamespace = io.of('/admin');
adminNamespace.use((socket, next) => {
    if (socket.nsp.name === '/admin') {
        const { token } = socket.handshake.query;
        if (!token) {
            return next(new Error('forbidden'));
        }
    }

    return next();
});

adminNamespace.on('connection', socket => {
    // admin events
    socket.on('GET_WORKSPACES', (_, cb) => {
        cb(namespaces);
    });

    socket.on('GET_MESSAGES', (user, cb) => {
        cb(messages[user]);
    });

    socket.on('SEND_MESSAGE', (namespace, message) => {
        message.id = new Date().valueOf() + Math.random().toFixed(16).substring(2);
        io.of(namespace).emit('admin-message', message);
    });
});

const workspaces = io.of(/^\/\w+$/);
workspaces.on('connection', socket => {
    const workspace = socket.nsp;
    namespaces[workspace.name] = [];

    socket.on('new-message', (data) => {
        if (data.type === 1) {
            messages[data.user].push(data);
            adminNamespace.emit('new-message', workspace.name, data);
        }
    });

    socket.on('new-user', (user) => {
        socket.user = user;
        const currentUsers = namespaces[workspace.name];

        if (currentUsers.indexOf(user) === -1) {
            namespaces[workspace.name].push(user);
            messages[user] = [];

            const userInfo = {
                address: socket.handshake.address,
                host: socket.handshake.headers.origin,
            };
            const message = `${user} joined. IP (${userInfo.address}), HOST (${userInfo.host})`;
            const data = {
                id: new Date().valueOf() + Math.random().toFixed(16).substring(2),
                user: user,
                message: message,
                type: 3,
            };
            adminNamespace.emit('new-user', workspace.name, data);
        }
    });

    socket.on('disconnect', () => {
        const data = {
            id: new Date().valueOf() + Math.random().toFixed(16).substring(2),
            user: socket.user,
            message: `${socket.user} left`,
            type: 3,
        };

        if (data.user) {
            messages[socket.user].push(data.message);
            adminNamespace.emit('user-left', workspace.name, data);
        }
    });
});


app.use(express.static(path.join(__dirname, 'client/dist')));

server.listen(process.env.APP_PORT, () => {
    console.log(`Vit2 chat app listening at http://localhost:${process.env.APP_PORT}`);
});
