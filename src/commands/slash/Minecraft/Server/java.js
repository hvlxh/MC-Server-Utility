const { SlashCommand } = require('discord-commands-params');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const util = require('minecraft-server-util');

module.exports = new SlashCommand({
    name: 'java',
    description: 'Get the server status of a MC: Java Edition.',
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
        const Port = options.getNumber('port') || 25565;

        const Embed = new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)
            .setTimestamp()

        try {
            const data = await util.status(IP, Port);
            Embed
                .setTitle(`${IP}:${Port}`)
                .setURL(`https://mcsrvstat.us/server/${IP}:${Port}`)
                .setThumbnail(`https://api.mcsrvstat.us/icon/${IP}:${Port}`)
                .setDescription(`>>> **IP:** ${IP}
**Port:** ${Port}
**Latency:** \`${data.roundTripLatency}\`ms 
**Icon:** [Link](https://api.mcsrvstat.us/icon/${IP})
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

            await interaction.editReply({
                embeds: [Embed],
            });
        } catch (e) {

        };
    },
});