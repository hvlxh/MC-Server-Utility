const { SlashCommand } = require('discord-commands-params');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const util = require('minecraft-server-util');

module.exports = new SlashCommand({
    name: 'is_queryable',
    description: 'Check the server is queryable or not.',
    options: [
        {
            name: 'ip',
            description: 'Provide a IP Address of a server.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'port',
            description: 'Provide a Port of a server.',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],
    run: async ({ client, interaction, options }) => {
        await interaction.deferReply();
        const IP = options.getString('ip');
        const Port = options.getNumber('port');

        const Embed = new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)
            .setTimestamp()

        try {
            const data = await util.queryFull(IP, Port);
            Embed.setDescription('The server is query-able!');

            await interaction.editReply({
                embeds: [Embed],
            });
        } catch (e) {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.embed.color)
                        .setDescription('The server is not query-able.'),

                    new EmbedBuilder()
                        .setColor('Red')
                        .setFooter(client.config.embed.footer)
                        .setTimestamp()
                        .setTitle('500 Internal Server Error')
                        .setDescription('```' + e + '```'),
                ],
            });
        };
    },
});