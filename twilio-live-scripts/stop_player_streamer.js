require('dotenv').config()
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

console.log("Stop Player Streamer");

try {
    client.media.playerStreamer('VJ31252a97283ceac5f08697738a728a5b')
        .update({status: 'ended'})
        .then(player_streamer => console.log(player_streamer.dateCreated));
} catch (e) {
    console.log(e.toString());
}