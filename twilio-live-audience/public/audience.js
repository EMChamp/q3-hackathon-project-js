const streamPlayer = document.getElementById('player');
const startEndButton = document.getElementById('streamStartEnd');

let player;
let watchingStream = false;
let roomSid = getRoomSidfromQueryString();
let playerStreamer = getPlayerStreamerSidQueryString();

const watchStream = async () => {
    try {
        const response = await fetch('/audienceToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({playerStreamer:playerStreamer}) // body data type must match "Content-Type" header
        });

        const data = await response.json();

        if (data.message) {
            alert(data.message);
            return;
        }

        player = await Twilio.Live.Player.connect(data.token, {playerWasmAssetsPath: '../livePlayer'});
        player.play();
        streamPlayer.appendChild(player.videoElement);

        watchingStream = true;
        startEndButton.innerHTML = 'leave stream';
        startEndButton.classList.replace('bg-green-500', 'bg-red-500');
        startEndButton.classList.replace('hover:bg-green-500', 'hover:bg-red-700');


        // Twilio Sync
        var syncClient = new Twilio.Sync.Client(data.token);

        // Open a Document by unique name and update its data
        syncClient.stream(`${roomSid}_ja-JP`)
            .then((stream) => {
                console.log('Successfully opened a message stream. SID:', stream.sid);
                console.log('Successfully opened a message stream. UniqueName:', stream.uniqueName);
                stream.on('messagePublished', (event) => {
                    console.log('Received a "messagePublished" event:', event);
                });
            })
            .catch((error) => {
                console.error('Unexpected error', error);
            });

        
    } catch (error) {
        console.log(error);
        alert('Unable to connect to livestream');
    }
}

const leaveStream = () => {
    player.disconnect();
    watchingStream = false;
    startEndButton.innerHTML = 'watch stream';
    startEndButton.classList.replace('bg-red-500', 'bg-green-500');
    startEndButton.classList.replace('hover:bg-red-500', 'hover:bg-green-700');
}

// sample url format: http://localhost:5000/watch?sid=RM00000
function getRoomSidfromQueryString(){
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());  
    if(params && params["roomSid"]) {
        console.log(params["roomSid"])
        return params["roomSid"];
    }else{
        console.log(new Error("missing query string parameter `roomSid`."))
    }

}


function getPlayerStreamerSidQueryString(){
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());  
    if(params && params["playerStreamerSid"]) {
        console.log(params["playerStreamerSid"])
        return params["playerStreamerSid"];
    }else{
        console.log(new Error("missing query string parameter `playerStreamerSid`."))
    }

}

