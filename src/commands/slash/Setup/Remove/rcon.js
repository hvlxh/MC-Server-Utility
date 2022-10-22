const { SlashCommand } = require("discord-commands-params");
const { ApplicationCommandOptionType, ChannelType } = require("discord.js");
const DB = require('../../../../structures/schemas/RCON');

module.exports = new SlashCommand({
    name: "rcon",
    description: "Remove the RCON Setup.",
    options: [{
        name: "channel",
        description: "Provide a channel.",
        type: ApplicationCommandOptionType.Channel,
        channelTypes: [ChannelType.GuildText],
        required: true,
    }],
    run: async ({ client, interaction, options }) => {
        await interaction.deferReply();

        if (!interaction.memberPermissions.has('Administrator')) {
            return await interaction.editReply({
                content: 'The Permission `Administrator` required to use this command.',
                ephemeral: true,
            });
        };

        const channel = options.getChannel('channel');
        const doc = await DB.findOne({ Channel: channel.id }).exec();

        if (!doc) {
            return await interaction.editReply({
                content: 'Data not found. maybe provided invaild channel?',
                ephemeral: true,
            });
        };

        await doc.delete();
        await client.rcons.delete(channel.id);
        await interaction.editReply({
            content: 'Successfully deleted!',
            ephemeral: true,
        });
    },
});