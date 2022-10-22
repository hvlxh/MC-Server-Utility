const { SlashCommand } = require('discord-commands-params');
const { ApplicationCommandOptionType, EmbedBuilder, ChannelType } = require('discord.js');
const DB = require('../../../../structures/schemas/Status');
const util = require('minecraft-server-util');

module.exports = new SlashCommand({
    name: 'live-status',
    description: 'Add a live status system.',
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
            name: 'type',
            description: 'Query or Ping',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Query', value: 'query' },
                { name: 'Ping', value: 'ping' },
            ],
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
        const type = options.getString('type');
        const ip = options.getString('ip');
        const port = options.getNumber('port');
        const edition = options.getString('edition');
        const channel = options.getChannel('channel');

        if (!interaction.memberPermissions.has('Administrator')) {
            return await interaction.editReply({
                content: 'The Permission `Administrator` required to use this command.',
            });
        };

        const Embed = new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)
            .setTimestamp();

        if (type === 'query') {
            try {
                const data = await util.queryFull(ip, port);
                Embed
                    .setTitle(`${ip}:${port}`)
                    .setURL(`https://mcsrvstat.us/${edition}/${ip}:${port}`)
                    .setThumbnail(`https://api.mcsrvstat.us/icon/${ip}:${port}`)
                    .setDescription(`>>> **IP:** ${ip}
**Port:** ${port}
**Version:** ${data.version}
**Software:** ${data.software}
**Plugins:** ${data.plugins.join(', ') || 'None'}
**Map:** ${data.map}
                    `).addFields(
                        {
                            name: `**__Players Count:__**`,
                            value: `>>> **Online:** ${data.players.online.toLocaleString('en-US')}\n**Offline:** ${data.players.max.toLocaleString('en-US')}`,
                        },
                        {
                            name: '**__MOTD:__**',
                            value: `**Clean:**
${data.motd.clean}

**Raw:**
${data.motd.raw}

**HTML (Hyper Text Markup Language)**
${data.motd.html}
                            `
                        }
                    );

                const players = data.players.list.join(', ');
                let message;
                if (players.length > 1024) {
                    const Embed1 = new EmbedBuilder()
                        .setColor(client.config.embed.color)
                        .setDescription(players.substring(0, 4069));

                    message = await channel.send({
                        embeds: [Embed, Embed1],
                    });
                } else {
                    Embed.addFields({
                        name: '**__Players Names:__**',
                        value: players,
                    });

                    message = await channel.send({
                        embeds: [Embed],
                    });
                };

                DB.create({
                    IP: ip,
                    Port: port,
                    Type: type,
                    Edition: edition,
                    Channel: channel.id,
                    Message: message.id,
                });
                setInterval(async () => {
                    require('../../../../structures/functions/Status')(ip, port, type, edition, message, client);
                }, 60000);
            } catch (e) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('500 Internal Server Error')
                            .setDescription('```' + e + '```'),
                    ],
                });
            }
        } else {
            if (edition === 'server') {
                try {
                    const data = await util.status(ip, port);

                    Embed
                        .setTitle(`${ip}:${port}`)
                        .setURL(`https://mcsrvstat.us/server/${ip}:${port}`)
                        .setThumbnail(`https://api.mcsrvstat.us/icon/${ip}:${port}`)
                        .setDescription(`>>> **IP:** ${ip}
    **Port:** ${port}
    **Latency:** \`${data.roundTripLatency}\`ms
    **Icon:** [Link](https://api.mcsrvstat.us/icon/${ip}:${port})
    **Version:** ${data.version.name}
                    `).addFields(
                            {
                                name: `**__Players Count:__**`,
                                value: `>>> **Online:** ${data.players.online.toLocaleString('en-US')}\n**Offline:** ${data.players.max.toLocaleString('en-US')}`,
                            },
                            {
                                name: '**__MOTD:__**',
                                value: `**Clean:**
    ${data.motd.clean}

    **Raw:**
    ${data.motd.raw}

    **HTML (Hyper Text Markup Language)**
    ${data.motd.html}
                            `
                            }
                        );

                    const message = await channel.send({
                        embeds: [Embed],
                    });

                    DB.create({
                        IP: ip,
                        Port: port,
                        Type: type,
                        Edition: edition,
                        Channel: channel.id,
                        Message: message.id,
                    });
                    setInterval(async () => {
                        require('../../../../structures/functions/Status')(ip, port, type, edition, message, client);
                    }, 60000);
                } catch (e) {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Red')
                                .setTitle('500 Internal Server Error')
                                .setDescription('```' + e + '```'),
                        ],
                    });
                }
            } else {
                try {
                    const data = await util.statusBedrock(ip, port);

                    Embed
                        .setTitle(`${ip}:${port}`)
                        .setURL(`https://mcsrvstat.us/bedrock/${ip}:${port}`)
                        .setDescription(`>>> **IP:** ${ip}
    **Port:** ${port}
    **ID:** \`${data.serverID || 'None'}\`
    **GUID:** \`${data.serverGUID || 'None'}\`
    **Version:** ${data.version.name}
                        `).addFields(
                            {
                                name: `**__Players Count:__**`,
                                value: `>>> **Online:** ${data.players.online.toLocaleString('en-US')}\n**Offline:** ${data.players.max.toLocaleString('en-US')}`,
                            },
                            {
                                name: '**__MOTD:__**',
                                value: `**Clean:**
    ${data.motd.clean}

    **Raw:**
    ${data.motd.raw}

    **HTML (Hyper Text Markup Language)**
    ${data.motd.html}
                                `
                            },
                        );

                    const message = await channel.send({
                        embeds: [Embed],
                    });

                    await DB.create({
                        IP: ip,
                        Port: port,
                        Type: type,
                        Edition: edition,
                        Channel: channel.id,
                        Message: message.id,
                    });
                    setInterval(async () => {
                        require('../../../../structures/functions/Status')(ip, port, type, edition, message, client);
                    }, 60000);
                } catch (e) {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Red')
                                .setTitle('500 Internal Server Error')
                                .setDescription('```' + e + '```'),
                        ],
                    });
                }
            };
        };
    },
});