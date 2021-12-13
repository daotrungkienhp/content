const express = require('express');
const server = express.Router();
server.serviceName = 'router';

var Detector = require("device-detector-js");
const detector = new Detector();

// server.get('/', function(req, res, next) {
//     res.redirect('/index.html');
// });

server.get('/favicon.ico', function(req, res) {
    res.send('Hello');
});

server.get('/*', (req, res, next) => {
    res.send('Hello');
});

function getDevice(req) {
    var header = req.rawHeaders;
    var index = header.indexOf('user-agent');
    if (index === -1) {
        index = header.indexOf('User-Agent');
    }

    var userAgent = header[index + 1];
    var dv = detector.parse(userAgent);

    // console.log('device', dv);

    if (dv.device.type === 'mobile') {
        return 'mobile';
    }

    return 'desktop';
}

module.exports = server;














//-----------------------