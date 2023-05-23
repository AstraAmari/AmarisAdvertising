const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "help",
  description: "List the commands of the bot",
  aliases: ["commands", "h"],
  execute(message, args) {
    const { commands } = message.client;

    const embed = new EmbedBuilder().setTitle(
      `${message.client.user.tag}'s commands`
    );

    for (const command of commands.values()) {
      embed.addFields({ name: command.name, value: command.description });
    }
    message.channel.send({ embeds: [embed] });
  },
};
