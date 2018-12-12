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
  if (event.text && event.text.indexOf(ask_text) == -1) {
    const request = {
      session: sessionPath,
      queryInput: { text: { text: event.text, languageCode: languageCode } }
    };
    sessionClient
      .detectIntent(request)
      .then(responses => {
        const result = responses[0].queryResult;
        if (result.action == "input.todo") {
          rtm.webClient.chat.getPermalink(
            {
              channel: event.channel,
              message_ts: event.ts
            },
            (err, data) => {
              let link = data.permalink;
              rtm.webClient.chat.postMessage({
                text: `${ask_text}\n${link}`,
                attachments: [
                  {
                    text: event.text,
                    fallback: "失敗しました",
                    callback_id: "add_list",
                    color: "#3AA3E3",
                    attachment_type: "default",
                    actions: [
                      {
                        name: "boolean",
                        text: "追加する",
                        type: "button",
                        value: JSON.stringify({
                          is_add: true,
                          text: event.text,
                          link: link
                        }),
                        style: "primary"
                      },
                      {
                        name: "boolean",
                        text: "追加しない",
                        type: "button",
                        value: JSON.stringify({
                          is_add: false,
                          text: event.text,
                          link: link
                        })
                      }
                    ]
                  }
                ],
                channel: event.channel
              });
            }
          );
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
          `<@${e.user}> Todoに追加しました \n${link}`,
          e.item.channel
        );
      }
    );
  }
});
