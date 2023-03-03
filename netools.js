module.exports = class {


    constructor(webSocketServer) {
        const INTERVAL_PING_PONG = 1;
        this._wss = webSocketServer;
        this._onMessage = Function;
        function validMessage(d) {
            try {
                const msg = JSON.parse(d);
                if (typeof msg.target != 'string' ||
                    typeof msg.body == 'undefined') {
                    return false;
                }
                return msg;
            } catch (err) {
                return false;
            }
        }
        this._wss.on('connection', (client, req) => {
            client.ident = req.clientId;
            client.isAlive = true;
            console.log('New client: ' + client.ident);
            client.on('message', msg => {
                if (msg == 'pong') {
                    client.isAlive = true;
                    return;
                }

                const data = validMessage(msg);
                console.log('De: ' + client.ident);
                if (data)
                    this._onMessage(data, client);

            })
        })
        
        /* Teste de ping automatizado */
        setInterval(() => {
            this._wss.clients.forEach(client => {
                client.isAlive = false;
                client.send('ping');
                client.timeoutPing = setTimeout(() => {
                    if (!client.isAlive)
                        client.terminate();
                }, 3000);
            })
        }, 20000)
    }
    onMessage(f) {
        if (typeof f != 'function')
            throw new NetoolsException('O parâmetro passado deve ser uma function.');
        this._onMessage = f;
    }
    /**
     * @description Verifica se o cliente está conectado
     * @returns {undefined|object} undefined ou object se o cliente existir
     * @param {String} ident a identificação do cliente 
     */
    clientExist(ident = String) {
        let exist = undefined;
        this._wss.clients.forEach(client => {
            if (client.ident === ident)
                exist = client;
        });
        return exist;
    }

    /**
     * @description Envia mensagem ao cliente indicado
     * @param {Object} target A referência do cliente conectado
     * @param {String} origin A ID do cliente de origem
     * @param {*} data dados a serem mandado ao cliente 
     */
    response(target = Object, origin = Object, data = String) {
        if (typeof target != 'object')
            throw new NetoolsException('O target passando não uma referência válida.');
        if (typeof origin != 'object')
            throw new NetoolsException('O origin passando não uma referência válida.');
        const obj = {
            origin: origin.ident,
            body: data
        }
        console.log(obj);
        target.send(JSON.stringify(obj));
    }

    /**
     * @description Envia mensagens em broadcast (todos os clientes)
     * @param {*} data mensagem aserenviada  
     */
    broadcast(data) {
        this._wss.clients.forEach(client => {
            this.response(client, data);
        })
    }

}

class NetoolsException {
    constructor(msg) {
        this.name = 'NetoolsException';
        this.message = msg;
    }
}