const express = require("express");
const app = express();
const fs = require("fs");

app.get("/", function (req,res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/video", function (req, res) {
    console.log(req.headers);

    // ensure there is a range given for the video 
    const range = req.headers.range;
    if(!range){
        res.status(400).send("Requires Range header");
    }

    //get video stats ( about __MB)
    const videoPath = "video.mp4";
    // const videoPath = "Aerial Shot of a Lighthouse.mp4";
    const videoSize = fs.statSync(videoPath).size;
    console.log(videoSize);
    console.log("~f~~~~!");

    //Parse Range
    //Example 'bytes=50994886-'
    const CHUNK_SIZE = 5 * 20 ** 5;
    console.log("~~~~~!");

    const start =0;// Number(range.replace(/\D/g, ""));// 'bytes=6750208-' => 6750208
    console.log("~~~~~!");

    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    console.log(start,videoSize);

    // create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "viedo/mp4"
    };
    res.writeHead(206, headers);
    const videoSteam = fs.createReadStream(videoPath,{start,end}); 
    videoSteam.pipe(res);
});

app.listen(8000, function() {
    console.log("Listening on port 8000!");
});