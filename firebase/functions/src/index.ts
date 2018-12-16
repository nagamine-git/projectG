import * as functions from "firebase-functions";

const admin = require('firebase-admin');
admin.initializeApp()
const db = admin.firestore()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest(async (request, response) => {
  let payload = JSON.parse(request.body.payload);
  let request_value = JSON.parse(payload.actions[0].value);
  let user_name = payload.user.name;
  let text = request_value.is_add
    ? `:white_check_mark: ${user_name}が追加しました！`
    : `:hand: ${user_name}が追加を許可しませんでした。`;

  if(request_value.is_add) {
    await db.collection('tasks').add({
      "title": `${request_value.text}`,
      "description": `${request_value.link.permalink}`,
      "id": 3,
      "sequence": 2
    })
  }

  response.send({
    text: `XorListに追加しますか？\n${request_value.link.permalink}`,
    attachments: [
      {
        author_name: payload.user.name,
        attachment_type: "default",
        text: `${request_value.text}\n${text}`,
        color: "#3AA3E3"
      }
    ]
  });
});
