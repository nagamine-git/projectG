const { RTMClient } = require("@slack/client");
const token = process.env.NODE_KEY;

const rtm = new RTMClient(token);

rtm.start();

const projectId = "xorassistant";
const sessionId = "quickstart-session-id";
const languageCode = "ja";

// Instantiate a DialogFlow client.
const dialogflow = require("dialogflow");
const sessionClient = new dialogflow.SessionsClient();

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

rtm.on("message", async event => {
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: event.text,
        languageCode: languageCode
      }
    }
  };
  sessionClient
    .detectIntent(request)
    .then(responses => {
      const result = responses[0].queryResult;
      if (result.action == "input.todo") {
        rtm.sendMessage(
          `Todo追加しますか？ \n 追加する場合は => :writing_hand:`,
          event.channel
        );
      }
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
});

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
