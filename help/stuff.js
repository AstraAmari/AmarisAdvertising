const keywords = ["example", "keyword", "phrase"];

client.on("presenceUpdate", (_, newPresence) => {
  const member = newPresence.member;

  if (
    member?.presence?.activities.some(
      (activity) => activity.type === "CUSTOM_STATUS"
    )
  ) {
    const customStatus = member.presence.activities.find(
      (activity) => activity.type === "CUSTOM_STATUS"
    );
    const statusWords = customStatus.state.split(" ");
    const matchedKeywords = statusWords.filter((word) =>
      keywords.includes(word.toLowerCase())
    );

    if (matchedKeywords.length > 0) {
      const matchedKeywordsText = matchedKeywords.join(", ");
      console.log(
        `${member.user.tag} has the following keywords in their custom status: ${matchedKeywordsText}`
      );

      // Ban the user
      // member
      //   .ban({ reason: "Custom status contains banned keywords." })
      //   .then(() =>
      //     console.log(
      //       `${member.user.tag} has been banned for their custom status.`
      //     )
      //   )
      //   .catch(console.error);
    }
  }
});
