const { Client, Intents, ChannelType } = require("discord.js");
const cron = require("cron");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});
const channelId = "YOUR_CHANNEL_ID";

// Schedule cron job to run every two hours
const cronJob = new cron.CronJob("0 0 */2 * * *", async () => {
  try {
    const channel = await client.channels.fetch(channelId);
    if (!ChannelType.GuildText) return;

    const messages = await channel.messages.fetch({ limit: 100 });
    const invites = messages.filter((msg) =>
      msg.content.includes("discord.gg")
    );

    for (const invite of invites.values()) {
      const regex =
        /(discord.gg\/|discordapp.com\/invite\/|discord.com\/invite\/)([a-zA-Z0-9_-]+)/;
      const match = invite.content.match(regex);
      const inviteCode = match ? match[2] : null;
      if (!inviteCode) continue;

      try {
        const inviteExists = await client
          .fetchInvite(inviteCode)
          .then((invite) => (invite.guild ? true : false))
          .catch((error) => {
            if (error.code === 10006) {
              // Invite has expired or is invalid
              return false;
            }
            throw error;
          });

        if (!inviteExists) {
          const sender = invite.author;
          await invite.delete();
          console.log(
            `Invalid invite deleted in channel ${channel.name}: ${invite.content}`
          );
          try {
            await sender.send(
              "Your invite is invalid. Please make sure to use a valid server invite."
            );
            console.log(
              `DM sent to ${sender.username}: Your invite in ${channel.name} is invalid.`
            );
          } catch (error) {
            console.error(
              `Failed to send DM to user ${sender.username}:`,
              error
            );
          }
        }
      } catch (error) {
        console.error(
          "An error occurred while checking invite validity:",
          error
        );
      }
    }
  } catch (error) {
    console.error("An error occurred while checking invites:", error);
  }
});
cronJob.start();
