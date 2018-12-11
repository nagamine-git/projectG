import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  let payload = JSON.parse(request.body.payload);
  let is_add_task = payload.actions[0].value;
  let user_name = payload.user.name;
  let text =
    is_add_task == "true"
      ? `:white_check_mark: ${user_name}が追加しました！`
      : `:hand: ${user_name}が追加を許可しませんでした。`;

  response.send({
    text: "XorListに追加しますか？",
    attachments: [
      {
        attachment_type: "default",
        text: text,
        color: "#3AA3E3"
      }
    ]
  });
});
