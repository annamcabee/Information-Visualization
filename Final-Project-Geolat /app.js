// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var db = require('./helpers/db');
var Result = require('./models/result.js')(db.Sequelize, db.sequelize);
var sockets = require('./helpers/sockets')(io, Result);
var filterAndCalculate = require('./helpers/utils').filterAndCalculate;

db.sequelize.sync();

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Templating
app.set('view engine', 'pug');

// Routing
app.use('/public', express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    Result.findAll().then(function(results) {
        res.render('index', { title: 'GeoLat - Latency Agency', results: filterAndCalculate(results)});
    });
});
app.get('/results', function (req, res) {
    Result.findAll().then(function(results) {
        res.json(filterAndCalculate(results));
    });
});
