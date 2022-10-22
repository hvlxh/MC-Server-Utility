const { SlashCommand } = require('discord-commands-params');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const util = require('minecraft-server-util');

module.exports = new SlashCommand({
    name: 'parse_address',
    description: 'Get the server port by its ip.',
    options: [{
        name: 'ip',
        description: 'Provide a IP.',
        type: ApplicationCommandOptionType.String,
        required: true,
    }],
    run: async ({ client, interaction, options }) => {
        await interaction.deferReply();
        const IP = options.getString('ip');

        const Embed = new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer);

        try {
            const d = await util.parseAddress(IP);
            Embed.setDescription(`>>> **IP:** ${IP}
**Port:** ${d.port}            
            `);

            await interaction.editReply({
                embeds: [Embed],
            });
        } catch (e) {
            Embed.setTitle('Can\'t parse the address.')
            const Embed1 = new EmbedBuilder()
                .setColor('Red')
                .setTitle('500 Internal Server Error')
                .setDescription('```' + e + '```');

            await interaction.editReply({
                embeds: [Embed, Embed1],
            });
        };


    },
});