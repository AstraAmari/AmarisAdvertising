const {
    Client,
    GatewayIntentBits,
    PermissionsBitField,
    Collection,
    EmbedBuilder,
  } = require("discord.js"),
  fs = require("fs"),
  config = require("./data/config.json"),
  client = new Client({
    partials: [
      "MESSAGE",
      "CHANNEL",
      "REACTION",
      "GUILD_MEMBER",
      "USER",
      "VOICE",
      "DIRECT_MESSAGES",
    ],
    intents:
      3276799 |
      GatewayIntentBits.MessageContent |
      GatewayIntentBits.DirectMessages,
  }),
  token = config.token,
  prefix = config.prefix;

const { loadCommands } = require("./Handlers/commands.js");

client.once("ready", async () => {
  console.log(`${client.user.tag} is online`);
  client.commands = new Collection();
  loadCommands(client);
});

client.on("messageCreate", async (message) => {
  const msg = message;
  if (msg.author.bot) return;

  // Cmd handler stuff
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();
  if (message.content.startsWith(config.prefix)) {
    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );
    if (command) {
      try {
        command.execute(message, args);
      } catch (error) {
        console.error(error);
        message.reply("There was an error trying to run that command!");
      }
    }
  }

  //blacklisted words

  const blockedWords = [
    "kys",
    "ky2",
    "killyourself",
    "k y 2",
    "k y s",
    "k.y.s",
    "KYS",
    "Kys",
    "KYs",
    "kYs",
    "kyS",
    "nigga",
    "Nigga",
    "nigger",
    "white trash",
    "White trash",
    "@everyone",
    "@here",
  ];

  if (blockedWords.includes(message.content)) {
    if (
      message.member.permissions.has(PermissionsBitField.Flags.Administrator)
    ) {
      return;
    } else {
      await message.delete();
      await message.channel.send(
        `${message.author.tag} do not say that here. Member banned.`
      );
      if (message.member.bannable) {
        return await message.member.ban();
      } else {
        console.log(
          `I cannot ban ${message.author.tag}, they said ${message.content}`
        );
      }
    }
  }

  const ignoredChannels = [
    "1098624707286282272",
    "1098624713284136960",
    "1098624719181336617",
    "1099390233990144110",
    "1099390131720425513",
    "1098624735572656168",
    "1099389290003300495",
    "1098624747698393179",
    "1099389417472397403",
    "1099699611448377344",
    "1099705778207731872",
    "1099391946713215056",
    "1100150971755151441",
    "1099391447398088726",
    "1099391557184008313",
    "1099391848616837160",
    "1099397273064063027",
    "1099397312545042525",
    "1099703957716217997",
    "1098624785749114951",
    "1098624791583400058",
    "1099393692416086106",
    "1099393858028183662",
    "1098624758985273406",
    "1098624764278476810",
    "1098624802564087919",
    "1098624774768443442",
    "1098624769458450633",
    "1098624807970553977",
    "1098624813410553947",
    "1098624819760734218",
    "1100862659592720414",
    "1098624830871449620",
    "1098624836680560690",
    "1098624841952788571",
    "1098624847388622869",
    "1098624852740546671",
    "1098625076858978344",
    "1098625082278027357",
    "1098625087739002880",
    "1098625099264954408",
    "1098624904133357658",
    "1098624942788063343",
  ];

  if (ignoredChannels.includes(message.channel.id)) return; // Ignore specified channels

  const responseChannel = message.channel;
  const responseContent = new EmbedBuilder().setColor("Random").addFields({
    name: `Thank you for advertising in ${message.guild.name}`,
    value: [
      `Follow the server rules, found in <#1110228068318060665>`,
      `Make sure your invite link is set to permanent.`,
      `If you leave, all your invites will be deleted`,
    ].join("\n"),
  });
  responseChannel.send({ embeds: [responseContent] });

  const messagesFilePath = "logs/messages.json"; // Path to the JSON file for saving messages

  let messages = {};

  // Load saved messages from JSON file
  if (fs.existsSync(messagesFilePath)) {
    const data = fs.readFileSync(messagesFilePath, "utf8");
    messages = JSON.parse(data);
  }

  if (ignoredChannels.includes(message.channel.id)) return; // Ignore specified channels

  const channelId = message.channel.id;
  const userId = message.author.id;
  const content = message.content;

  // Save message to the JSON object
  if (!messages[channelId]) {
    messages[channelId] = {};
  }
  if (!messages[channelId][userId]) {
    messages[channelId][userId] = [];
  }
  messages[channelId][userId].push(content);

  // Write messages to JSON file
  fs.writeFile(messagesFilePath, JSON.stringify(messages), (err) => {
    if (err) throw err;
    console.log(`Message from ${message.author.tag} saved to JSON file.`);
  });
});

client.login(token);
