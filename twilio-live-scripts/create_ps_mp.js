require('dotenv').config()
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
var room_sid = 'RMb2af27f17f88798757566a953a72a910'
// var player_streamer_sid;

// Create player streamer
async function createPlayerStreamerAndMediaProcessor() {
    try {
        var newPlayerStreamer = await client.media.playerStreamer
            .create()
        // return newPlayerStreamer.sid;
    // } catch (e) {
    //     console.log(e);
    //     console.log(e.toString());
    // }

// Created media processor if player streamer was successfully created
// async function createMediaProcessor() {
        if (newPlayerStreamer.sid && newPlayerStreamer.sid.length != 0) {
            // try {
            var newMediaProcessor = await client.media.mediaProcessor
                .create({
                    extension: 'video-composer-v1',
                    extensionContext: JSON.stringify({
                        identity: 'video-composer-v1',
                        room: {
                            name: room_sid
                        },
                        outputs: [
                            newPlayerStreamer.sid
                        ]
                    })
                })
                // .then(media_processor => console.log("Media Processor SID = " + media_processor.sid));
            console.log("Media Processor SID = " + newMediaProcessor.sid)
            console.log("Player Streamer SID = " + newPlayerStreamer.sid)
        }
    } catch (e) {
        console.log(e);
        console.log(e.toString());
    // }
    }
// }

}
createPlayerStreamerAndMediaProcessor()
// console.log("Player Streamer SID = " + player_streamer_sid);
// createMediaProcessor();