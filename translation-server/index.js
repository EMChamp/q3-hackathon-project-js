/****
 * 
 * Twilio Products used:
 * - Twilio Video
 * - Twilio Video Interpolation
 * - Twilio Voice
 * - Twilio Voice Media Stream
 * - Twilio Sync
 * 
 * Other Products used:
 *  - Google Cloud Translation (Beta)
 * 
 * Descriptions: This simple WebSocket servier listen on port 8080, and forward incoming WS to Google Cloud Translation. 
 * then publish translated text to Twilio Sync.
 * 
 * Setup: The internal logic expects inbound Twilio Media Stream traffic forked from Twiml, and some custom parameter are expected:
 * - language: the target translation language (soure language is hard coded to 'en-US').
 * - syncServiceSid: the Sync Service SID containing the Twilio Sync Stream, not to confuse with the Media Stream.
 * - streamSid: the Sync Stream Sid, which will be populated with transalted text.
 * 
 * Sample Twiml:
 *     <Start>
 *         <Stream url="${translationServerEndpoint}" track="outbound_track" >
 *             <Parameter name="language" value="ja-JP" />
 *             <Parameter name="syncServiceSid" value="${syncServiceSid}" />
 *             <Parameter name="streamSid" value="${newStream1.sid}" />
 *         </Stream>
 *     </Start>
 *
 * Other setup note: this environment require the following envrionment variable, put this in .env if you use dontenv:
 * - GOOGLE_APPLICATION_CREDENTIALS="/Users/...path to your google json credentials -284116-3264002da51d.json"
 * - TWILIO_ACCOUNT_SID=get from Twilio console.
 * - TWILIO_AUTH_TOKEN=get from Twilio console.
 * 
 */

// Read .env to environment, where we put our GOOGLE_APPLICATION_CREDENTIALS
require("dotenv").config();

const twilio = require('twilio');
const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const WebSocket = require("ws");
const express = require("express");
const http = require("http");
// Imports the Cloud Media Translation client library
const { SpeechTranslationServiceClient } = require('@google-cloud/media-translation'); 

// Create web socket server
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {

  console.log("New Connection Initiated");

  let isIgnoreStream = false;
  let recognizeStream = null;
  let isFirst = true;
  let sourceLanguageCode = 'en-US'
  let targetLanguageCode;
  let syncServiceSid;
  let streamSid;
  
  ws.on("message", function incoming(message) {

    // Parse websocket message
    const msg = JSON.parse(message);
    switch (msg.event) {

      case "connected":
        console.log(`A new call has connected.`);
        break;

      case "start":
        if(!msg.start.customParameters){
          // missing customParam
          isIgnoreStream = true;
          break;
        }
        console.log(`Starting Media Stream: ${msg.start.customParameters.streamSid}`);
        console.log(`parameters: ${msg.start.customParameters}`);
        targetLanguageCode = msg.start.customParameters.language;
        syncServiceSid = msg.start.customParameters.syncServiceSid;
        streamSid = msg.start.customParameters.streamSid;
        
        
        // Create Stream to the Google Speech to Text API
        recognizeStream = new SpeechTranslationServiceClient()
            .streamingTranslateSpeech()
            .on('error', e => {
              if (e.code && e.code === 4) {
                console.log('Streaming translation reached its deadline.');
              } else {
                console.log(e);
              }
            })
            .on('data', async response => {
              // console.log("Data received");
              const {result, speechEventType} = response;
           
              currentTranslation = result.textTranslationResult.translation;
              // currentRecognition = result.recognitionResult;
              console.log(`\nPartial translation: ${currentTranslation}`);
              // console.log(`Partial recognition result: ${currentRecognition}`);

              // Publish to Twilio Sync
              try{
                console.log("publishing to:" + streamSid);
              var newMessage = await twilioClient.sync.services(syncServiceSid)
                .syncStreams(streamSid)
                .streamMessages
                .create({ 'data': { 'translation':currentTranslation } } );
                // .then(stream_message => console.log(stream_message.sid));
                // console.log(newMessage.sid)
              } catch(e){
                console.log(e)
              }
            });
        break;

      case "media":
        if(isIgnoreStream){
          break;
        }
        const config = {
          audioConfig: {
            audioEncoding: 'mulaw',
            sampleRateHertz: 8000,
            sourceLanguageCode: sourceLanguageCode,
            targetLanguageCode: targetLanguageCode,
          },
          singleUtterance: false,
        };

        if (isFirst) {
          // First request needs to have only a streaming config, no data.
          recognizeStream.write({
            streamingConfig: config,
            audioContent: null,
          });
          isFirst = false;
        } 

        recognizeStream.write({
          streamingConfig: config,
          audioContent: msg.media.payload.toString('base64'),
        });

        break;

      case "stop":
        if(isIgnoreStream){
          break;
        }
        console.log(`Call Has Ended`);
        recognizeStream.destroy();
        break;
    }
  });
});

// app.use(express.static("public"));

console.log("Listening on Port 8080");
server.listen(8080);