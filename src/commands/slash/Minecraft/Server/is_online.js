const { SlashCommand } = require('discord-commands-params');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const util = require('minecraft-server-util');

module.exports = new SlashCommand({
    name: 'is_online',
    description: 'Check the server is online or not.',
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
        {
            name: 'edition',
            description: 'Select an option.',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Java', value: 'server' },
                { name: 'Bedrock', value: 'bedrock' },
            ],
        },
    ],
    run: async ({ client, interaction, options }) => {
        await interaction.deferReply();
        const IP = options.getString('ip');
        const Port = options.getNumber('port');

        const Embed = new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)
            .setTimestamp();

        const Edition = options.getString('edition');
        if (Edition === 'server') {
            try {
                const data = await util.status(IP, Port);

                Embed.setDescription('The server is online!');
                interaction.editReply({
                    embeds: [Embed],
                });
            } catch (e) {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('500 Internal Server Error')
                            .setDescription('```' + e + '```'),
                    ],
                });
            };
        } else {
            try {
                const data = await util.statusBedrock(IP, Port);

                Embed.setDescription('The server is online!');
                interaction.editReply({
                    embeds: [Embed],
                });
            } catch (e) {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.embed.color)
                            .setDescription('The server is not online.'),

                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('500 Internal Server Error')
                            .setFooter(client.config.embed.footer)
                            .setTimestamp()
                            .setDescription('```' + e + '```'),
                    ],
                });
            };
        };
    },
});