require('dotenv').config()
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.media.mediaProcessor('ZX7349e9c940d8e4ac536e3b2f1ec6d74b')
    .update({status: 'ended'})
    .then(media_processor => console.log(media_processor.sid));