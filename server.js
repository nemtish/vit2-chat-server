'use strict'

require('dotenv').config()

const express = require('express');
const { createEventAdapter } = require('@slack/events-api');
const projectDependencies = require('./app/config/projectDependencies');
const DashboardController = require('./app/controllers/DashboardController');
const ChatController = require('./app/controllers/ChatController');
const SlackController  = require('./app/controllers/SlackController');

const app = express();
const port = process.env.APP_PORT || 3000;
const slackEvents = createEventAdapter('6deee9db3ccba6f2b32479c49199c235');

projectDependencies.DatabaseService.initDatabase().then(() => {
    // load middleware
    app.use('/slack/events', slackEvents.expressMiddleware());
    app.use(express.static(require('path').join(__dirname, 'client/dist')));

    const server = app.listen(port, () => {
        console.log(`Vit2 chat app listening at http://localhost:${port}`);
    });

    // configure socket
    projectDependencies.Socket.init(server);

    // add socket controllers
    const client = 'vitamin2';
    (new ChatController(projectDependencies)).listen(client);
    (new DashboardController(projectDependencies)).listen(client);
    (new SlackController(projectDependencies)).listen(client, slackEvents);
});

