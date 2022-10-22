const { SlashCommand } = require('discord-commands-params');
const { EmbedBuilder, time, ActionRowBuilder, SelectMenuBuilder, ComponentType, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require("fs");
const Loader = require('../../../structures/functions/Loader');

module.exports = new SlashCommand({
    name: 'help',
    description: 'Get the info of the bot.',
    run: async ({ client, interaction, options }) => {
        const strings = `
**__Bot__**        
<:Blank:1033257889747451914></bot change-logs:1033233499810971648> - Get the bot recent changes.
<:Blank:1033257889747451914></bot help:1033233499810971648> - Get the info of the bot.
<:Blank:1033257889747451914></bot ping:1033233499810971648> - Get the bot latency.
<:Blank:1033257889747451914></bot stats:1033233499810971648> - Get the bot statstics.

**__Minecraft__**
<:Blank:1033257889747451914>**__Server__**
<:Blank:1033257889747451914><:Blank:1033257889747451914></minecraft server bedrock:1033233499810971649> - Get the server status of a MC: Bedrock Edition.
<:Blank:1033257889747451914><:Blank:1033257889747451914></minecraft server is_online:1033233499810971649> - Check the server is online or not.
<:Blank:1033257889747451914><:Blank:1033257889747451914></minecraft server is_queryable:1033233499810971649> - Check the server is queryable or not.
<:Blank:1033257889747451914><:Blank:1033257889747451914></minecraft server java:1033233499810971649> - Get the server status of a MC: Java Edition.
<:Blank:1033257889747451914><:Blank:1033257889747451914></minecraft server parse_address:1033233499810971649> - Get the server port by its ip.
<:Blank:1033257889747451914><:Blank:1033257889747451914></minecraft server query:1033233499810971649> -Get the server status of a Minecraft server. Including players list, plugins, server software.

**__Setup__**
<:Blank:1033257889747451914>**__Add__**
<:Blank:1033257889747451914><:Blank:1033257889747451914></setup add rcon:1033233499810971650> - Add RCON Setup.
<:Blank:1033257889747451914><:Blank:1033257889747451914></setup add live-status:1033233499810971650> - Add Live Status Setup.
<:Blank:1033257889747451914>**__Remove__**
<:Blank:1033257889747451914><:Blank:1033257889747451914></setup add rcon:1033233499810971650> - Remove RCON Setup.
<:Blank:1033257889747451914><:Blank:1033257889747451914></setup add live-status:1033233499810971650> - Remove Live Status Setup.
        `

        const Components = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Invite')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/api/oauth2/authorize?client_id=980510491640229939&permissions=2214976705&scope=bot%20applications.commands'),

            new ButtonBuilder()
                .setLabel('Support Server')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/invite/bycBhzS5dy'),

            new ButtonBuilder()
                .setLabel('Vote')
                .setStyle(ButtonStyle.Link)
                .setURL('https://top.gg/bot/980510491640229939'),
        );

        const Embed2 = new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setTitle('Commands:')
            .setDescription(strings);

        const Embed1 = new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setTitle('Help')
            .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
            .setFooter(client.config.embed.footer)
            .setTimestamp()
            .setDescription(`
**__Available Categories:__**
> Minecraft
> Setup
> Bot

**__Statstics__**
Ping: \`${client.ws.ping}\`ms
Uptime: ${time(client.readyAt, 'R')}
Servers: \`${client.guilds.cache.size}\`
Users: \`${client.users.cache.size}\`
        `);

        await interaction.reply({
            embeds: [Embed1, Embed2],
            components: [Components]
        });
    },
});