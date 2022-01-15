var http = require("http");
var fs = require("fs");

console.log("Server Starting at localhost 3000");
http.createServer( (requet,response) =>  {
        response.writeHead(200, {'Conten-Type': 'viedo/mp4' });
        var rs = fs.createReadStream("viedo.mp4");
        rs.pipe(response);
}).listen(3000);