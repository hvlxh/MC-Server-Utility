const { SlashCommand } = require('discord-commands-params');
const { EmbedBuilder, ApplicationCommandOptionType, ChannelType } = require('discord.js');
const util = require('minecraft-server-util');
const DB = require('../../../../structures/schemas/RCON')

module.exports = new SlashCommand({
    name: 'rcon',
    description: 'Setup the rcon.',
    options: [
        {
            name: 'ip',
            description: 'Provide a IP.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'port',
            description: 'Provide a Port.',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'password',
            description: 'Provide the Password of the Server\'s RCON.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'channel',
            description: 'Provide a channel.',
            type: ApplicationCommandOptionType.Channel,
            required: true,
            channelTypes: [ChannelType.GuildText]
        },
    ],
    run: async ({ client, interaction, options }) => {
        await interaction.deferReply({ ephemeral: true });
        const ip = options.getString('ip');
        const port = options.getNumber('port');
        const pass = options.getString('password');
        const channel = options.getChannel('channel');

        if (!interaction.memberPermissions.has('Administrator')) {
            return await interaction.editReply({
                content: 'The Permission `Administrator` required to use this command.',
            });
        }

        const rcon = new util.RCON();
        await rcon.connect(ip, port).catch(async (e) => {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('500 Internal Server Error')
                        .setDescription('```' + e + '```'),
                ],
            });
        });
        await rcon.login(pass).catch(async (e) => {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('500 Internal Server Error')
                        .setDescription('```' + e + '```'),
                ],
            });
        });

        await DB.create({
            IP: ip,
            Port: port,
            Pass: pass,
            Channel: channel.id
        });
        client.rcons.set(`${channel.id}`, `${ip}:${port}:${pass}`);
        await channel.send({
            content: `to use the \`${ip}:${port}\` commands, use it like \`-<command>\``,
        });
    },
});