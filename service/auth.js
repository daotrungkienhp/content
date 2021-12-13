const async = require('async');
var ODB = require('odb');

global.__session = global.__session || {};
const SESSION = global.__session;
const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes

const NOT_FOUND = 'user not found';

/**
 * User login to his or her node
 * */
function login(uid, password, callback) {

    async.waterfall([
            function(callback) { // find account

                var spaceLoc = [uid, 'user'].join('-');
                var filters = {
                    and: [
                        { name: "id", op: "eq", val: uid },
                        { name: "password", op: "eq", val: password }
                    ]
                };

                var db = new ODB({ uid: uid });

                db.search(spaceLoc, filters, 0, 1, '', 'no-cache', (data) => {
                    var user = data.list[0];
                    var err = (user) ? null : NOT_FOUND;
                    callback(err, user);
                });
            },
            function(user, callback) { // generate token
                if (user.token) { return callback(null, user); }

                user.token = random(64);

                var db = new ODB({ uid: uid });
                db.save(user.loc, user, (err) => {
                    callback(err, user);
                });
            },
            function(user, callback) { // create session

                SESSION[user.token] = {
                    uid: user.id,
                    loc: user.loc,
                    token: user.token,
                    // groups: user.groups, // user perpision group.
                    ticks: new Date().getTime()
                };
                callback(null, user);
            }
        ],
        function(err, user) {
            user = user || {};
            callback(err, { uid: user.id, loc: user.loc, token: user.token });
        });
}

/**
 * Check user authorize
 * 
 * @callback: session of user
 * */
function auth(uid, token, callback) {

    /**
        TODO: this verison
        - check all user is on the one node ---> next: user access data on other node.
        - client send uid  ---> next: client send loc of user.
    */

    if (!uid || !token) {
        return callback({ uid: ODB.GUEST() });
    }

    var session = SESSION[token];
    if (session) {
        // extends expiration time
        session.ticks = new Date().getTime();
        return callback(session);
    }

    // find account

    var spaceLoc = [uid, 'user'].join('-');
    var filters = {
        and: [{ name: "id", op: "eq", val: uid }]
    };

    var db = new ODB({ uid: uid });

    db.search(spaceLoc, filters, 0, 1, '', 'no-cache', (data) => {
        var user = data.list[0] || {};

        if (!user.token || user.token !== token) {
            return callback(null);
        }

        session = SESSION[user.token] = {
            uid: user.id,
            loc: user.loc,
            token: user.token,
            // groups: user.groups, // user perpision group.
            ticks: new Date().getTime()
        };

        callback(session);
    });
}

function cleanSession() {
    var ticks = new Date().getTime() - SESSION_TIMEOUT;
    Object.keys(SESSION).forEach(function(token) {
        if (SESSION[token].ticks < ticks)
            delete SESSION[token];
    });
}

function random(length) {
    var ran = '';
    var chat = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var leng = chat.length;
    for (var i = 0; i < length; i++) {
        ran += chat.charAt(Math.floor(Math.random() * leng));
    }
    return ran;
}


function init(req, res, next) {
    // console.log('AUTH');
    next();

    // const INVALID_REQUEST = "Invalid request";

    // var body = JSON.parse(req.body.params || null) || {};

    // var uid = '' + (body.uid || req.headers['uid']);
    // if (uid === 'undefined') {
    //     uid = ODB.GUEST();
    // }

    // var token = '' + (req.body.token || req.headers['token']);
    // if (token === 'undefined') {
    //     token = req.headers['x-token'];
    // }

    // // console.log('request', req.path, uid, token, body.password);

    // if (req.method === 'POST' && req.path === '/api/user-login') {

    //     login(uid, body.password, (err, user) => {

    //         res.json({
    //             code: (err) ? 1 : 0,
    //             data: user,
    //             time: new Date().getTime()
    //         });

    //     });

    //     return;
    // }

    // auth(uid, token, (session) => {
    //     // console.log('req', req.method, req.path, session);
    //     if (!session) {
    //         return res.json({
    //             code: 1,
    //             error: INVALID_REQUEST
    //         });
    //     }

    //     if (req.method === 'POST' && req.path.indexOf('/api/sv') > -1) {
    //         var oid = req.headers['oid'];
    //         if (oid === 'undefined') {
    //             oid = null;
    //         }

    //         session.oid = (oid || req.body.oid || req.body.uid);
    //     }

    //     req.__session = session;
    //     next();
    // });
}

module.exports = {
    init: init,
    auth: auth,
    login: login,
    cleanSession: cleanSession
};

















//