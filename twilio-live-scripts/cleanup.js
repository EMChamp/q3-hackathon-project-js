require('dotenv').config()
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

let cleanUp = async () => {
  

    var mediaProcessorList = await client.media.mediaProcessor.list({status: "started", limit: 20})
    var playerStreamerList = await client.media.playerStreamer.list({status: "started", limit: 20})
        
    mediaProcessorList.forEach(async mediaProcessor => {
        console.log(mediaProcessor.sid);
        await client.media.mediaProcessor(mediaProcessor.sid).update({status: 'ended'});
    }); 

    playerStreamerList.forEach(async playerStreamer => {
        console.log(playerStreamer.sid);
        await client.media.playerStreamer(playerStreamer.sid).update({status: 'ended'});
    });

};

cleanUp();

