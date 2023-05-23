client.on("guildMemberAdd", (member) => {
  const joinData = {
    userId: member.user.id,
    userTag: member.user.tag,
    joinTime: new Date().toISOString(),
    leaveTime: null,
  };

  // Load existing data from the JSON file
  let existingData = [];
  if (fs.existsSync(jsonFilePath)) {
    const data = fs.readFileSync(jsonFilePath, "utf8");
    existingData = JSON.parse(data);
  }

  // Add join data
  existingData.push(joinData);

  // Write data to JSON file
  fs.writeFileSync(jsonFilePath, JSON.stringify(existingData));

  console.log(
    `User ${joinData.user.tag} joined the server at ${joinData.joinTime}`
  );
});

client.on("guildMemberRemove", (member) => {
  const leaveData = {
    userId: member.user.id,
    userTag: member.user.tag,
    leaveTime: new Date().toISOString(),
  };

  // Load existing data from the JSON file
  let existingData = [];
  if (fs.existsSync(jsonFilePath)) {
    const data = fs.readFileSync(jsonFilePath, "utf8");
    existingData = JSON.parse(data);
  }

  // Find the corresponding join data and update the leave time
  const joinData = existingData.find(
    (data) => data.userId === leaveData.userId
  );
  if (joinData) {
    joinData.leaveTime = leaveData.leaveTime;
  }

  // Write updated data to JSON file
  fs.writeFileSync(jsonFilePath, JSON.stringify(existingData));

  console.log(
    `User ${leaveData.user.tag} left the server at ${leaveData.leaveTime}`
  );
});
