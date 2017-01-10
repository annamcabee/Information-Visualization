// Socket gloabal variables
var INTERVAL_TIME = 3000;   // ms
var RTT_PING_COUNT = 10;
var average = require('./utils').average;
var reverseGeocode = require('./utils').reverseGeocode;

module.exports = function(io, Result) {
    // Socket setup
    io.on('connection', function(socket) {
        var count = 0;
        var measurements = [];
        var located = false;
        var pinged = false;
        var result = Result.build({});

        console.log("ADDRESS " + socket.request.connection.remoteAddress);

        // On connection, begin the RTT measuring loop
        // Measure once every INTERVAL_TIME seconds to get a good average value
        var pingInterval = setInterval(function() {
            var payload = {
                time: Date.now(),
                id: count,
                uuid: result.uuid
            };
            socket.emit('tripFromServer', payload);
            count += 1;
            if (count > RTT_PING_COUNT) {
                clearInterval(pingInterval);
            }
        }, INTERVAL_TIME);

        // Listen for the RTT response from the server
        socket.on("tripFromClient", function (payload) {
            var latency = (Date.now() - payload.time) / 2;
            measurements.push(latency);
        });

        // Listen for the geolocation response from the server
        // payload = {uuid, lat, lon, timestamp}
        socket.on("location", function (payload) {
            located = true;
            result.location = { type: 'Point', coordinates: [payload.lat, payload.lon]};
        });

        // On disconnect, make sure the measurment is stored or destroyed
        // if data is not complete.
        socket.on('disconnect', function() {
            result.rtt = average(measurements);
            if (measurements.length > 0 && located) {
                reverseGeocode(result, function(err, result) {
                    if (err) {
                        console.warn("NO ADDRESS");
                    }
                    result.save();
                });
            } else {
                result.destroy();
            }
       });
    });

    return io;
};
