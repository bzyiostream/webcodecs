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

function createWebSocketServer(server) {
    let wss = new WebSocketServer({
        server: server
    });
    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            client.send(data);
        });
    };
    wss.on('connection', function (ws) {
        ws.on('message', (data)=>{wss.broadcast(data)});
        ws.on('close', ()=>{});
        ws.on('error', ()=>{});
    });
    console.log('WebSocketServer was attached.');
    return wss;
}

createWebSocketServer(server);

console.log('app started at port 8000...');