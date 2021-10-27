require('dotenv').config()
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.media.mediaProcessor
    .create({
        extension: 'video-composer-v1',
        extensionContext: JSON.stringify({
            identity: 'video-composer-v1',
            room: {
                name: 'RM72d5defa64b99c9b297e2680ab8a2cd3'
            },
            outputs: [
                'VJ853a76f94ee9dca427a25b879aa7504b'
            ]
        })
    })
    .then(media_processor => console.log(media_processor.sid));