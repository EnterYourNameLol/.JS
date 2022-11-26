const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
 
        console.log(`Gotowy! ${client.user.tag} jest zalogowany i jest online!`);

        client.user.setPresence({
            activities: [{ name: `Twitch`, type: ActivityType.Watching }],
            status: 'dnd',
          });
    },
};