const { EmbedBuilder } = require('discord.js');
const util = require('minecraft-server-util');

/*
 * 
 * @param {string} ip 
 * @param {number} port 
 * @param {string} type 
 * @param {string} edition 
 * @param {import('discord.js').Message} message
 * @param {import('../lib/Client')} client 
 */
module.exports = async (ip, port, type, edition, message, client) => {
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
            if (players.length > 1024) {
                const Embed1 = new EmbedBuilder()
                    .setColor(client.config.embed.color)
                    .setDescription(players.substring(0, 4069));

                await message.edit({
                    embeds: [Embed, Embed1],
                });
            } else {
                Embed.addFields({
                    name: '**__Players Names:__**',
                    value: players,
                });

                await message.edit({
                    embeds: [Embed],
                });
            };
        } catch (e) {
            await message.edit({
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

                await message.edit({
                    embeds: [Embed],
                });
            } catch (e) {
                await message.edit({
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

                await message.edit({
                    embeds: [Embed],
                });
            } catch (e) {
                await message.edit({
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
}