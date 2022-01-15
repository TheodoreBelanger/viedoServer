// var http = require("http");
// var fs = require("fs");

// console.log("Server Starting at localhost 3000");
// http.createServer( (requet,response) =>  {
//         response.writeHead(200, {'Conten-Type': 'viedo/mp4' });
//         var rs = fs.createReadStream("video.mp4");
//         rs.pipe(response);
// }).listen(3000);

const express = require("express");
const app = express();
const fs = require("fs");

app.get("/", function (req,res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/pmms-dui", function (req, res) {
    console.log(req.headers);

    //ensure there is a range given for the viedo 
    const range = req.headers.range;
    if(!range){
        res.status(400).send("Requires Range header");
    }

    //get video stats ( about __MB)
    const videoPath = "video.mp4";
    const videoSize = fs.statsSync(videoPath).size;
    console.log(videoSize);

    //Parse Range
    //Example 'bytes=6750208-'
    const CHUNK_SIZE = 5 * 20 ** 5;// ~500 KB => 500000 Bytes
    const start = Number(range.replace(/|D/g,""));// 'bytes 6750208' => 6750208
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    console.log(start,end);

    // create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": 'bytes ${start}-${end}/${videoSize}',
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "viedo/mp4"
    };
    //Http Status 206 for Partial Conent
    res.writeHead(206, headers);
    //create viedo read stream for this particular chunk
    const viedoSteam = fs.createReadStream(videoPath,{start,end});
    //stream video chunk to client 
    viedoSteam.pipe(res);
});

app.listen(8000, function() {
    console.log("Listening on port 8000!");
});