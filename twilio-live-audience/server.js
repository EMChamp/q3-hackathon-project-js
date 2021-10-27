import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import crypto from 'crypto';
import twilio from 'twilio';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 5000;

const AccessToken = twilio.jwt.AccessToken;
// const VideoGrant = AccessToken.VideoGrant;
const SyncGrant = AccessToken.SyncGrant;
const PlaybackGrant = AccessToken.PlaybackGrant;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKey = process.env.TWILIO_API_KEY_SID;
const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;

const twilioClient = twilio(apiKey, apiKeySecret, { accountSid: accountSid });

// Start the Express server
app.listen(port, async () => {
    console.log(`Express server running on port ${port}`);
});

app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: __dirname });
});

app.get('/stream', (req, res) => {
    res.sendFile('public/streamer.html', { root: __dirname });
});

app.get('/watch', (req, res) => {
    res.sendFile('public/audience.html', { root: __dirname });
});

/**
 * Get an Access Token for an audience member
 */
app.post('/audienceToken', async (req, res) => {
    console.log("audience token");
    // Generate a random string for the identity
    const identity = crypto.randomBytes(20).toString('hex');

    try {
        // Get the first player streamer
        //const playerStreamerList = await twilioClient.media.playerStreamer.list({status: 'started'});
        //const playerStreamer = playerStreamerList.length ? playerStreamerList[0] : null;

        // If no one is streaming, return a message

        // Otherwise create an access token with a PlaybackGrant for the livestream
        const token = new AccessToken(accountSid, apiKey, apiKeySecret);

        // Create a playback grant and attach it to the access token
        const playerStreamerSid = 'VJf61680c54132a07728ace63e18f4be03';
        const playbackGrant = await twilioClient.media.playerStreamer(playerStreamerSid).playbackGrant().create({ttl: 60});

        const wrappedPlaybackGrant = new PlaybackGrant({
            grant: playbackGrant.grant
        });

        token.addGrant(wrappedPlaybackGrant);
        token.identity = identity;

        // TODO: moved serviceSid to .config file.
        //// Twilio Sync              
        const syncGrant = new SyncGrant({
            serviceSid: "IS74f478376e2bd19c3bfef5441d89e244"
        });
        token.addGrant(syncGrant);



        // Serialize the token to a JWT and return it to the client side
        return res.send({
            token: token.toJwt()
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: `Unable to view livestream`,
            error
        });
    }
});