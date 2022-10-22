const { SlashCommand } = require('discord-commands-params');
const { EmbedBuilder, time } = require('discord.js');
const os = require('os');

module.exports = new SlashCommand({
    name: 'stats',
    description: 'Get the bot statstics',
    run: async ({ client, interaction, options }) => {
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        arr.reverse();
        const memUsed = process.memoryUsage().heapUsed / 1024 / 1024;

        var startTime = process.hrtime()
        var startUsage = process.cpuUsage()
        var now = Date.now()
        while (Date.now() - now < 500)
            var elapTime = process.hrtime(startTime)
        var elapUsage = process.cpuUsage(startUsage)
        var elapTimeMS = secNSec2ms(elapTime)
        var elapUserMS = secNSec2ms(elapUsage.user)
        var elapSystMS = secNSec2ms(elapUsage.system)
        var cpuPercent = Math.round(100 * (elapUserMS + elapSystMS) / elapTimeMS)

        const Embed = new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setTitle('Bot - Statstics')
            .setAuthor({
                name: client.user.tag,
                iconURL: client.user.displayAvatarURL(),
            }).setDescription(`
Name: ${client.user.tag}
ID: \`${client.user.id}\`
Slash Commands (Including Subs): \`${client.commands.collection.size}\`
Context Commands: \`${client.contexts.collection.size}\`
Total Commands: \`${client.contexts.collection.size + client.commands.collection.size}\`
        `).addFields(
                {
                    name: 'Bot',
                    value: `
Servers: \`${client.guilds.cache.size}\`
Users: \`${client.users.cache.size}\`
Channels: \`${client.channels.cache.size}\`
Uptime: ${time(client.readyAt, 'R')}
                `
                },
                {
                    name: 'System',
                    value: `
RAM: Approximately \`${Math.round(memUsed * 100) / 100}\`MB
CPU: \`${cpuPercent}\`%
Node Version: \`${process.version}\`
                `
                }
            );
        await interaction.reply({
            embeds: [Embed],
        });
    },
});

function secNSec2ms(secNSec) {
    return secNSec[0] * 1000 + secNSec[1] / 1000000
}