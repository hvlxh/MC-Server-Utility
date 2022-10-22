const { SlashCommand } = require("discord-commands-params");
const { ChannelType, ApplicationCommandOptionType } = require("discord.js");
const DB = require('../../../../structures/schemas/Status');

module.exports = new SlashCommand({
    name: 'live-status',
    description: 'Remove the live status setup.',
    options: [{
        name: 'channel',
        description: 'Select an channel.',
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


        if (!doc)
            return await interaction.editReply({
                content: 'Data not found. maybe you provided invaild channel?',
                ephemeral: true,
            });

        const message = await channel.messages.fetch(doc.Message);

        await doc.delete();
        await message.delete();
        clearInterval(client.serversInveral.find((e) => e === `${doc.IP}:${doc.Port}`));

        await interaction.editReply({
            content: 'Successfully deleted!',
            ephemeral: true,
        });
    },
});