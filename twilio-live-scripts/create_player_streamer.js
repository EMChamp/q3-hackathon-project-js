require('dotenv').config()
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

console.log("Create Player Streamer");
try {
    client.media.playerStreamer
        .create()
        .then(player_streamer => player_streamer_sid = player_streamer.sid);
} catch (e) {
    console.log(e.toString());
}
