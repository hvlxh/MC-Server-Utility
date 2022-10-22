const { SlashCommand } = require('discord-commands-params');
const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const util = require('minecraft-server-util');

module.exports = new SlashCommand({
    name: 'bedrock',
    description: 'Get the server status of a MC: Bedrock Edition.',
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
            required: false,
        },
    ],
    run: async ({ client, interaction, options }) => {
        await interaction.deferReply();
        const IP = options.getString('ip');
        const Port = options.getNumber('port') || 19132;

        const Embed = new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)
            .setTimestamp()

        try {
            const data = await util.statusBedrock(IP, Port);

            Embed
                .setTitle(`${IP}:${Port}`)
                .setURL(`https://mcsrvstat.us/bedrock/${IP}:${Port}`)
                .setDescription(`>>> **IP:** ${IP}
    **Port:** ${Port}
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

            await interaction.editReply({
                embeds: [Embed],
            });
        } catch (e) {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('500 Internal Server Error')
                        .setDescription('```' + e + '```'),
                ],
            });
        };
    },
});