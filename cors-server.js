var http = require('http');
var sys = require('util');
var fs = require('fs');

http.createServer(function(req, res) {
  debugHeaders(req);

  if (req.url == '/cors') {
    if (req.headers.origin && req.headers.origin == 'http://localhost') {
     processCors(req, res);
    } else {
      res.writeHead(403);
      res.end();
    }
  } else {
      res.writeHead(404);
      res.end();
  }
}).listen(8001);


function processCors(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json;charset=UTF-8',
    'Cache-Control': 'no-cache'
    ,'Access-Control-Allow-Origin': 'http://localhost'
  });

  var obj = {name:'José',surname:'Cantera'};
  
  res.write(JSON.stringify(obj));
  
  res.end();
}


function debugHeaders(req) {
  console.log('URL: ' + req.url);
  for (var key in req.headers) {
    console.log(key + ': ' + req.headers[key]);
  }
  console.log('\n\n');
}