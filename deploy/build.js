var fs = require('fs');
var path = require('path');
var archiver = require('archiver');
const { JSDOM } = require("jsdom");

const DEV_FOLDER = path.join(__dirname, '../client');
const DISTRO_FOLDER = DEV_FOLDER.replace('client', 'distro');

function buildApp() {
    var appPath = path.join(DEV_FOLDER, 'app.json');
    var app = JSON.parse(fs.readFileSync(appPath).toString('utf8'));


    var list = [];
    getFiles(DEV_FOLDER, list);

    var desFile;
    var desFolder = path.join(DISTRO_FOLDER, app.name, '/');

    list.forEach((file) => {
        desFile = file.replace(DEV_FOLDER, desFolder);

        var dir = path.dirname(desFile);
        // self.json({ code: 0, msg: "New distro was built completed!", time: dir });
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (file.endsWith('.json')) {
            if (path.basename(file) == "block.json") {

                let arrDir = dir.split('/');
                let nameBlock = arrDir[arrDir.length - 1];
                let configApp = JSON.parse(fs.readFileSync(file).toString('utf8'));

                app.blocks = app.blocks || {};
                app.blocks[nameBlock] = configApp
                let distroPath = DISTRO_FOLDER + app.name + "/";
                // var path = dir.replace(distroPath,'');
                let path = dir.replace(distroPath, '');

                app.blocks[nameBlock].path = path;
                console.log("app1", app)
            }
        }
        // if (file.endsWith('.html')) {
        //     compileHTMLFile(file, desFile);
        // } else {
        fs.copyFileSync(file, desFile);
        // }
    });
    if (app.blocks !== undefined) {
        delete app.blocks.null;
    }
    console.log('app', app)
    let newAppPath = path.join(desFolder, 'app.json');
    let newApp = JSON.stringify(app);
    fs.writeFileSync(newAppPath, newApp, { encoding: 'utf8' });
    packageApp(app.name, () => {
        console.log('Build completed');
        console.log("New distro was built completed!", new Date());
    });

}

function getFiles(dir, list) {
    var files = fs.readdirSync(dir);
    files.forEach((file) => {
        var name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, list);
        } else {
            list.push(name);
        }
    });
}

function packageApp(appId, callback) {

    var output = fs.createWriteStream(DISTRO_FOLDER + '/' + appId + '.zip');
    var archive = archiver('zip');

    output.on('close', function() {
        console.log('-->', appId + '.zip', archive.pointer(), 'bytes');
        callback();
    });
    archive.on('error', function(err) {
        throw err;
    });
    archive.pipe(output);
    archive.directory(DISTRO_FOLDER + '/' + appId, false);
    archive.finalize();
}

function compileHTMLFile(file, des) {

    var html = fs.readFileSync(file, { encoding: 'utf8' });

    const dom = new JSDOM(html);
    const document = dom.window.document;

    var list = document.getElementsByTagName('*');
    var elm;
    for (var i = list.length - 1; i >= 0; i--) {
        elm = list[i];
        if (!elm) {
            continue;
        }

        if (elm.getAttribute('#d') === "") {
            elm.parentElement.removeChild(elm);
            continue;
        }

        if (elm.getAttribute('#c') === "") {
            elm.innerHTML = "";
            elm.innerText = "";
            elm.removeAttribute('#c');
        }
    }

    html = dom.serialize();

    fs.writeFileSync(des, html, { encoding: 'utf8' });
}

buildApp();