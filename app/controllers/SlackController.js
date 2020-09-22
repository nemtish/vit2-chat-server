const { Socket } = require('../config/projectDependencies');

module.exports = (slackEvents) => {

    const listen = () => {
        slackEvents.on('message', event => {
            console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
            let blabla = {
               id: '16002624628406372612416626762',
                message: event.text,
                user: 'AAAAAAAAAAAAA',
                type: 1
            };

            Socket.io.of('/admin').emit('message', blabla);
        });
    }

    return {
        listen
    };
}
