const { WebClient } = require('@slack/web-api');
const { randomString } = require('./utils');

module.exports = class SlackService {

    constructor(userRepository) {
        const token = 'xoxb-58989877542-1339589721863-zMScxtnHWBLIAwsatCP5aBmw';
        this.web = new WebClient(token);
        this.sharedChannel = 'G01ATD3SWE8';
        this.conversations = {};
        this.userRepository = userRepository;
    }

    async createConversation(user) {
        const conversationName = `${user.name.toLowerCase()}_${randomString(6).toLowerCase()}`;
        const newConv = await this.web.conversations.create(
                {
                    name: conversationName,
                    users: 'U63969532',
                },
        );

        const conversationId = newConv.channel.id;
        this.conversations[user] = { conversationName, conversationId };
        this.web.conversations.invite(
            {
                channel: conversationId,
                users: 'U63969532',
            },
        );

        await this.userRepository.update(user.id, { conversationId });
    }

    async postMessage(user, slackMessage) {
        const { conversationId, conversationName } = this.conversations[user];

        const res = await this.web.chat.postMessage(
            { channel: this.sharedChannel, text: `Web Chat ${conversationName}: ${slackMessage}` }
        );
        const msg = await this.web.chat.postMessage(
            { channel: conversationId, text: slackMessage },
        );
    }
}
