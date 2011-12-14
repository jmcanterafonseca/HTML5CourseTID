var http = require("http")
  , WebSocketServer = require('websocket').server;

console.log(process.pid);

function serveFile(req,res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<!DOCTYPE html>' + '<html><body><p>Hello!!!</p></body></html>');
  res.end();
}

var httpSrv = http.createServer(serveFile);

var server = new WebSocketServer({
    httpServer: httpSrv,
    
    // Firefox 7 alpha has a bug that drops the
    // connection on large fragmented messages
    fragmentOutgoingMessages: false,
    autoAcceptConnections: false
});

var connections = [];


server.on('request', function(request) {
    var connection =  request.accept(null, request.origin);
    console.log((new Date()) + " Connection accepted.");
    
    console.log(connection.remoteAddress + " connected - Protocol Version " + connection.websocketVersion);
    
    connection.sendUTF( '<' + connection.remoteAddress + '>' + " connected - Protocol Version " + connection.websocketVersion);
    connections.forEach(function(destination) {
            destination.sendUTF('<' + connection.remoteAddress + '>' + ' has entered the room');
    });
    
    connections.push(connection);
    
    // Handle closed connections
    connection.on('close', function() {
        console.log('<' + connection.remoteAddress + '>' + " disconnected");
        
        var index = connections.indexOf(connection);
        if (index !== -1) {
            // remove the connection from the pool
            connections.splice(index, 1);
        }
        
        connections.forEach(function(destination) {
            destination.sendUTF('<' + connection.remoteAddress + '>' + ' has left the room');
        });
    });
    
    connection.on('message',function(message) {
      console.log('Message Received: ' + message.utf8Data);
      connections.forEach(function(destination) {
            destination.sendUTF('<' + connection.remoteAddress + '> ' + message.utf8Data);
        });
      });
  });


httpSrv.listen(8081, function() {
    console.log((new Date()) + " Server is listening on port 8081");
});