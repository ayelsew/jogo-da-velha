require('dotenv/config');
const webSocket = require('ws');
const static = require('node-static');
const file = new static.Server('./public', { cache: 0 });
const PORT = process.env.PORT ?? 3000 

const server = require('http').createServer((req, res) => {
    file.serve(req, res);
});

const webSocketServer = new webSocket.Server({
    server,
    clientTracking: true,
    verifyClient: require('./middleware/verifyClient')
});

webSocketServer.on("error", (error) => {
    console.log(error)
})
const Netools = new (require('./netools'))(webSocketServer);

new (require('./app'))(Netools);


server.listen(PORT, () => console.log(`WebServer online http://localhost:${PORT}`));



