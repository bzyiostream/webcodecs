var express = require('express');
var app = express();

// const url = require('url');
// var http = require('http').createServer(app);

var fs = require('fs');
var path = require('path');
let sslOptions = {
    key: fs.readFileSync('./default.zlmediakit.com.pem'), // 私钥
    cert: fs.readFileSync('./default.zlmediakit.com.pem') // 证书
};

const https=require('https').createServer(sslOptions, app);

const WebSocket = require('ws');

const WebSocketServer = WebSocket.Server;

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  app.get('/cbor.js', (req, res) => {
    res.sendFile(__dirname + '/cbor.js');
  });
  app.get('/player.js', (req, res) => {
    res.sendFile(__dirname + '/player.js');
  });
  app.get('/pusher.js', (req, res) => {
    res.sendFile(__dirname + '/pusher.js');
  });

app.get('/pub', (req, res) => {
   console.log(req,res);
});

let server = https.listen(8000);

let pub = null;
let sub = [];

function createWebSocketServer(server, onConnection, onClose, onError) {
    let wss = new WebSocketServer({
        server: server
    });
    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            client.send(data);
        });
    };
    onConnection = onConnection || function () {
        console.log('[WebSocket] connected.');
    };
    onClose = onClose || function (code, message) {
        console.log(`[WebSocket] closed: ${code} - ${message}`);
    };
    onError = onError || function (err) {
        console.log('[WebSocket] error: ' + err);
    };
    wss.on('connection', function (ws) {
        // console.log(ws.url);
        // let location = url.parse(ws.url, true);
        // console.log('[WebSocketServer] connection: ' + location.href);
        ws.on('message', (data)=>{wss.broadcast(data)});
        ws.on('close', onClose);
        ws.on('error', onError);
        // if (location.pathname == '/pub') {
        //     pub = ws;
        // }
        // if (location.pathname == '/sub') {
        //     sub.push(ws);
        // }
    });
    console.log('WebSocketServer was attached.');
    return wss;
}

var messageIndex = 0;

function createMessage(type, user, data) {
    messageIndex ++;
    return JSON.stringify({
        id: messageIndex,
        type: type,
        user: user,
        data: data
    });
}

function onConnect() {
    // let user = this.user;
    // let msg = createMessage('join', user, `${user.name} joined.`);
    // this.wss.broadcast(msg);
    // // build user list:
    // let users = this.wss.clients.map(function (client) {
    //     return client.user;
    // });
    // this.send(createMessage('list', user, users));
}

// function onMessage(message) {
//     this.wss.broadcast(message);
//     // console.log(message);
//     // if (message && message.trim()) {
//     //     let msg = createMessage('chat', this.user, message.trim());
//     //     this.wss.broadcast(msg);
//     // }
// }

function onClose() {
    // let user = this.user;
    // let msg = createMessage('left', user, `${user.name} is left.`);
    // this.wss.broadcast(msg);
}

createWebSocketServer(server, onConnect, onClose);

console.log('app started at port 8000...');