const util = require('minecraft-server-util');
const { EmbedBuilder } = require('discord.js');

function sendEmbeds(text, message) {
    const arr = text.match(/(.|[\r\n]){1,4069}/g);

    let embeds = [];
    for (let chunk of arr) {
        let embed = new EmbedBuilder()
            .setColor(0x36393F)
            .setDescription(chunk);

        embeds.push(embed);
    };

    message.reply({ embeds });
};


module.exports = {
    name: 'messageCreate',
    /**
     * 
     * @param {import("discord.js").Message} message 
     * @param {import("../../structures/lib/Client")} client 
     */
    run: async (message, client) => {
        const data = client.rcons.get(message.channel.id);
        if (
            message.author.bot ||
            !message.content.startsWith("-") ||
            !data
        ) return;

        const splits = data.split(":");
        const ip = splits[0];
        const port = Number(splits[1]);
        const pass = splits[2];

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

        const content = message.content.replace('-', '');
        const response = await rcon.execute(content);

        sendEmbeds(response, message);
        rcon.close();
    },
};