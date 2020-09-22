'use strict'

require('dotenv').config()

const express = require('express');
const projectDependencies = require('./app/config/projectDependencies');
const DashboardController = require('./app/controllers/DashboardController');
const ChatController = require('./app/controllers/ChatController');

const app = express();
const port = process.env.APP_PORT || 3000;

projectDependencies.DatabaseService.initDatabase().then(() => {
    // load middleware
    app.use(express.static(require('path').join(__dirname, 'client/dist')));

    const server = app.listen(port, () => {
        console.log(`Vit2 chat app listening at http://localhost:${port}`);
    });

    // configure socket
    projectDependencies.Socket.init(server);
    // add socket controllers
    const client = 'vitamin2';
    const chatController = new ChatController(projectDependencies);
    chatController.listen(client);

    const dashboardController = new DashboardController(projectDependencies);
    dashboardController.listen(client);
});

