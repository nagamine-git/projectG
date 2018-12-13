import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  let payload = JSON.parse(request.body.payload);
  let request_value = JSON.parse(payload.actions[0].value);
  let user_name = payload.user.name;
  let text = request_value.is_add
    ? `:white_check_mark: ${user_name}が追加しました！`
    : `:hand: ${user_name}が追加を許可しませんでした。`;

  response.send({
    text: `XorListに追加しますか？\n${request_value.link.permalink}`,
    attachments: [
      {
        attachment_type: "default",
        text: `${request_value.text}\n${text}`,
        color: "#3AA3E3"
      }
    ]
  });
});
