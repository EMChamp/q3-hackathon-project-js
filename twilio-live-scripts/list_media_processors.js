require('dotenv').config()
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


try {
    client.media.mediaProcessor
        .list({status: "started", limit: 20})
        .then(mediaProcessor => mediaProcessor.forEach(m => console.log(m.sid)));
} catch (e) {
    console.log("Error Occured");
    console.log(e.toString());
}
console.log("Successful Run");

