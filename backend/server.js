const fs = require("fs");
const https = require("https");
const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.static(__dirname + '/public'));
app.use(express.json());


// const key = fs.readFileSync("./certs/cert.key");
// const cert = fs.readFileSync("./certs/cert.crt"); //for https locally


// const expressServer = https.createServer({key, cert},app); for https locally
const expressServer = http.createServer(app); 

// const io = socketIo(expressServer,{
//     cors:['https://localhost:5173']
// });


const io = socketIo(expressServer,{
    cors:[
            'http://www.hangout.linkpc.net/',
            'http://api.hangout.linkpc.net/',
         ]
});

expressServer.listen(8181);



module.exports = { io, expressServer, app };