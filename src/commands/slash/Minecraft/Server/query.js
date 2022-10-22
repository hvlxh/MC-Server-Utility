const { SlashCommand } = require('discord-commands-params');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const util = require('minecraft-server-util');

module.exports = new SlashCommand({
    name: 'query',
    description: 'Get the server status of a Minecraft server. Including players list, plugins, server software.',
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
        const Edition = options.getString('edition');

        const Embed = new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)
            .setTimestamp()

        try {
            const data = await util.queryFull(IP, Port);
            Embed
                .setTitle(`${IP}:${Port}`)
                .setURL(`https://mcsrvstat.us/${Edition}/${IP}:${Port}`)
                .setThumbnail(`https://api.mcsrvstat.us/icon/${IP}:${Port}`)
                .setDescription(`>>> **IP:** ${IP}
**Port:** ${Port} 
**Version:** ${data.version.name}
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
            if (players.length > 1024) {
                const Embed1 = new EmbedBuilder()
                    .setColor(client.config.embed.color)
                    .setDescription(players.substring(0, 4069));

                await interaction.editReply({
                    embeds: [Embed, Embed1],
                });
            } else {
                Embed.addFields({
                    name: '**__Players Names:__**',
                    value: players,
                });

                await interaction.editReply({
                    embeds: [Embed],
                });
            };

            await interaction.editReply({
                embeds: [Embed],
            });
        } catch (e) {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription('```' + e + '```'),
                ],
            });
        };
    },
});