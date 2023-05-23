const fs = require("fs");
const path = require("path");

const commandsPath = path.join(__dirname, "../Commands");

function loadCommands(client) {
  fs.readdirSync(commandsPath).forEach((folder) => {
    const folderPath = path.join(commandsPath, folder);

    fs.readdirSync(folderPath).forEach((file) => {
      if (!file.endsWith(".js")) return;

      const command = require(path.join(folderPath, file));
      client.commands.set(command.name, command);
    });
  });
}

module.exports = { loadCommands };
