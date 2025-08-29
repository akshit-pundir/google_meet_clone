const https = require("https");
const fs = require("fs");
const express = require("express");
const socketIo = require("socket.io");
const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.static(__dirname + '/public'));
app.use(express.json());


const key = fs.readFileSync("./certs/cert.key");
const cert = fs.readFileSync("./certs/cert.crt");


const expressServer = https.createServer({key, cert},app);

const io = socketIo(expressServer,{
    cors:['https://localhost:5173']
});

expressServer.listen(8181);



module.exports = { io, expressServer, app };