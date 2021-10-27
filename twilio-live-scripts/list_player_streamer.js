require('dotenv').config()
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

console.log("Rooms Created");

try {
    client.media.playerStreamer
        .list({status: "created", limit: 20})
        .then(playerStreamer => playerStreamer.forEach(p => console.log(p.sid)));
} catch (e) {
    console.log("Error Occured");
    console.log(e.toString());
}
console.log("Rooms Started");
try {
    client.media.playerStreamer
        .list({status: "started", limit: 20})
        .then(playerStreamer => playerStreamer.forEach(p => console.log(p.sid)));
} catch (e) {
    console.log("Error Occured");
    console.log(e.toString());
}

console.log("Successful Run");

