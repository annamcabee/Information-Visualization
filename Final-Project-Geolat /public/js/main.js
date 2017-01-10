// Define global variables
var socket;
var uuid;

// If the browser does not support geolocation, just show the data
if (navigator.geolocation) {
    $('#agreement').modal('show');
}

// Add onclick actions to the modal buttons
$("#agree").on("click", collectAndSubmit);

// Setup sockets, respond to RTT messages, and send location
function collectAndSubmit() {
    socket = io.connect();

    socket.on('tripFromServer', function(data){
        // Immediately send the response to minimize client latency effects
        socket.emit('tripFromClient', data);

        // Store the UUID for to send with the geo response
        uuid = data.uuid;

        // Begin geolocation sequence
        if (data.id === 0) {
            geoLocate();
        }
    });
}

// Tap into browser geolocation api and send over websockets
function geoLocate() {
    navigator.geolocation.getCurrentPosition(
        sendPosition,                   // Callback if user can be located
        logError,                       // Callback if failure or user revokes location access
        { enableHighAccuracy: true }   // Use most accurate location when available
    );
}

// Deconstruct the geo object that the browser api returns and send relevant info
function sendPosition(geo) {
    var data = {
        uuid: uuid,
        lat: geo.coords.latitude,
        lon: geo.coords.longitude,
        timestamp: geo.timestamp
    };
    socket.emit('location', data);
}

// Log the error to the console.
function logError(err) {
    console.warn("There was an error retrieving your location.");
    console.warn(err);
}
