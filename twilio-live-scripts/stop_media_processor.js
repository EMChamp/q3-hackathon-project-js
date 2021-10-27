require('dotenv').config()
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.media.mediaProcessor('ZXd178350977b75803eacab30f2ef17a6c')
    .update({status: 'ended'})
    .then(media_processor => console.log(media_processor.sid));