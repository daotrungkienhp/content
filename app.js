const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('client'));
app.use(express.static('deploy'));

const cors = require('cors');
app.use(cors());
app.options('*', cors()) // include before other routes

app.use((req, res, next) => {
    next(); // http://expressjs.com/en/resources/middleware/csurf.html
});

const auth = require('./service/auth');
app.use(auth.init);

const router = require('./service/router');
app.use('/', router);

//------------------------------------------- apis
let dir = path.join(__dirname, 'service');
let files = fs.readdirSync(dir);
files.forEach((file) => {

    // console.log('file', file);
    if (file.endsWith('.js')) {
        let service = require('./service/' + file);
        let name = (service) ? service.serviceName : null;

        if (name && name !== 'router' && name !== 'auth') {
            console.log('add service', file);
            app.use('/api/' + name, service);
        }
    }

});


// start app
const port = parseInt(process.argv[2]) || 3000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});


















//--