const { ApplicationCommandType } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "ready",
  once: true,
  /**
   *
   * @param {import('../../structures/lib/Client')} client
   */
  run: (client) => {
    client.logger.log("Client is Running!", ["CLIENT"]);

    const all = [];
    client.commands.array.forEach((c) => all.push(c));
    client.contexts.array.forEach((c) => all.push(c));
    client.application.commands.set(all).then((cmds) => {
      cmds.each((c) => {
        if (c.type === ApplicationCommandType.Message) {
          client.logger.log(`Loaded "${c.name}"`, ["CONTEXT_MESSAGE"]);
        } else if (c.type === ApplicationCommandType.User) {
          client.logger.log(`Loaded "${c.name}"`, ["CONTEXT_USER"]);
        } else {
          client.logger.log(`Loaded "${c.name}:${c.id}"`, ["SLASH"]);
        }
      });
    });

    mongoose
      .connect(client.config.mongodb)
      .then(() => client.logger.log(`Connected to Database`, ["MONGODB"]))
      .catch((e) =>
        client.logger.error(`Error while connecting to the database. ${e}`, [
          "MONGODB",
        ])
      );

    ["Status", "RCON", "Errors"].forEach((system) =>
      require(`../../structures/systems/${system}`)(client)
    );
  },
};
