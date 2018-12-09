const { RTMClient } = require("@slack/client");
const token = process.env.NODE_KEY;

const rtm = new RTMClient(token);

rtm.start();

rtm.on("reaction_added", async event => {
  if (event.reaction == "writing_hand") {
    const e = event;
    rtm.webClient.chat.getPermalink(
      {
        channel: e.item.channel,
        message_ts: e.item.ts
      },
      (err, data) => {
        let link = data.permalink;
        rtm.sendMessage(
          `<@${e.user}> Todoに追加しました ${link}`,
          e.item.channel
        );
      }
    );
  }
});
