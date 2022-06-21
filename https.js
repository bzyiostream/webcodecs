var https = require('https');
var fs = require('fs');
 
var options = {
  key: fs.readFileSync('./default.zlmediakit.com.pem'), // 私钥
  cert: fs.readFileSync('./default.zlmediakit.com.pem') // 证书
};
 
var server = https.createServer(options, function(req, res){
  res.end('这是来自HTTPS服务器的返回');
});
 
server.listen(3000);