const dialogflow = require("dialogflow");
const { RTMClient } = require("@slack/client");
const uuid = require("uuid");

const token = process.env.NODE_KEY;

const rtm = new RTMClient(token);

rtm.start();

const projectId = "xorassistant";
const languageCode = "ja";

const sessionClient = new dialogflow.SessionsClient();

const ask_text = "XorListに追加しますか？";

rtm.on("message", event => {
  const sessionId = uuid.v4();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);
  if (event.text && event.text != ask_text) {
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
          rtm.webClient.chat.postMessage({
            text: ask_text,
            attachments: [
              {
                fallback: "失敗しました",
                callback_id: "add_list",
                color: "#3AA3E3",
                attachment_type: "default",
                actions: [
                  {
                    name: "boolean",
                    text: "追加する",
                    type: "button",
                    value: "true",
                    style: "primary"
                  },
                  {
                    name: "boolean",
                    text: "追加しない",
                    type: "button",
                    value: "false"
                  }
                ]
              }
            ],
            channel: event.channel
          });
        }
      })
      .catch(err => {
        console.error("ERROR:", err);
      });
  }
});

rtm.on("reaction_added", event => {
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
