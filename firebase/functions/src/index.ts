import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  console.log("request");
  console.log(request.body);
  response.send({
    text: "XorListに追加しますか？",
    attachments: [
      {
        attachment_type: "default",
        text: ":white_check_mark: 追加しました！",
        color: "#3AA3E3"
      }
    ]
  });
});
