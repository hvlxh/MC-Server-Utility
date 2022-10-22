const { SlashCommand } = require('discord-commands-params');
const { EmbedBuilder } = require("discord.js");

module.exports = new SlashCommand({
    name: 'change-logs',
    description: 'Get the bot recent changes.',
    run: async ({ client, interaction, options }) => {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Bot Change Logs')
                    .setColor('DarkButNotBlack')
                    .addFields(
                        require('../../../structures/lib/Log')
                    ),
            ],
        });
    },
});