require('dotenv/config');
const webSocket = require('ws');
const static = require('node-static');
const file = new static.Server('./public', { cache: 0 });

const server = require('http').createServer((req, res) => {
    file.serve(req, res);
});

const webSocketServer = new webSocket.Server({
    server,
    clientTracking: true,
    verifyClient: require('./middleware/verifyClient')
});


const Netools = new (require('./netools'))(webSocketServer);

new (require('./app'))(Netools);


server.listen(process.env.PORT, () => console.log('WebServer online'));



