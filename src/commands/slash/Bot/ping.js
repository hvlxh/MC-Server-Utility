const { SlashCommand } = require('discord-commands-params');

module.exports = new SlashCommand({
    name: 'ping',
    description: 'Get the bot latency',
    run: async ({ client, interaction, options }) => {
        const message = await interaction.reply({
            content: 'Pinging...',
            fetchReply: true,
        });
        await interaction.editReply({
            content: `Pong! 
> 🏓 Latency: \`${Date.now() - message.createdTimestamp}\`ms            
> 🤖 API Latency: \`${Math.round(client.ws.ping)}\`ms
            `,
        });
    },
});