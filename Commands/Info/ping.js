module.exports = {
  name: "ping",
  description: "Shows the bots ping!",
  aliases: [],
  async execute(message, args) {
    message.channel.send(`${message.client.ws.ping}ms`);
  },
};
