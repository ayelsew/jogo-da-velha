class Network {
    
    constructor() {
        this.EXPIREINVITE = 15;
        function genNum() { return Math.round(Math.random() * 99) };
        function validMsg(msg) {
            try {
                const data = JSON.parse(msg);
                if (typeof data.origin != 'string' ||
                    typeof data.body == 'undefined')
                    return false;
                return data;
            } catch (err) {
                console.log(err);
                return false;
            }
        }
        this._identify = `TIC${genNum()}TAC${genNum()}TOE${genNum()}`;
        console.log('Key: ' + this._identify);
        this._remoteIdentify = undefined;
        this._addressServer = undefined;
        this._webSocket = Object;
        this._onInvite = Function;
        this._pendingInvite = Object;
        this._pendingInvited = Object;
        this._onInvitedAwnser = Function;
        this._onPaiered = Function;
        this._onMsgPlayer = Function;
        this._onMsgGame = Function;
        this._onExpiredInvite = Function;
        this._timerExpireInvite = Function;
        this._configWebSocket = () => {
            this._webSocket.onmessage = (event) => {
                if (event.data == 'ping') {
                    this._webSocket.send('pong');
                    return;
                }
                /* Prcessa as mensagens recebidas */
                const msg = validMsg(event.data);

                if (msg.origin != this.getOrigin()) {

                    if (msg.body.action == 'pair') {
                        console.log('Convite recebido.');
                        this._pendingInvite = msg;
                        this._onInvite(msg.body.config)
                            .then(op => {
                                const msg = this._pendingInvite;
                                if (op.awnser == undefined) {
                                    console.log('O convite expirou');
                                    this._pendingInvite = undefined;
                                } else if (op.awnser == true) {
                                    console.log('Convite aceito.');
                                    this._remoteIdentify = msg.origin;
                                    const accept = JSON.stringify({
                                        target: msg.origin,
                                        body: {
                                            action: 'accept',
                                            config: op.info
                                        }
                                    });
                                    this._webSocket.send(accept);
                                    this._pendingInvite = undefined;
                                } else if (op.awnser == false) {
                                    console.log('Convite negado.');
                                    const denied = JSON.stringify({
                                        target: msg.origin,
                                        body: {
                                            action: 'denied',
                                            config: {}
                                        }
                                    });
                                    this._webSocket.send(denied);
                                    this._pendingInvite = undefined;
                                }
                            })
                            .catch(err => {
                                throw new NetworkException(err);
                            });
                    }

                    if (msg.origin == this._pendingInvited.target &&
                        /accept|denied/.test(msg.body.action)
                    ) {
                        console.log('Convite respondido.');
                        if (msg.body.action == 'accept') {
                            clearTimeout(this._timerExpireInvite);
                            console.log('O convite foi aceito.');
                            this._remoteIdentify = msg.origin;
                            this._onPaiered();
                            this._onInvitedAwnser(true, msg.body.config);
                            this._pendingInvited = undefined;
                        } else {
                            clearTimeout(this._timerExpireInvite);
                            console.log('O convite foi negado.');
                            this._pendingInvited = undefined;
                            this._onInvitedAwnser(false, msg.body.config);
                        }
                    }
                }

                if (msg.origin == this.getOrigin()) {
                    if (msg.body.action == 'game') {
                        this._onMsgGame(msg);
                    } else if (msg.body.action == 'player') {
                        this._onMsgPlayer(msg);
                    }
                }

            }
        }
        /* Verifica quando online ou offline */
        this._onOffline = Function;
        this._onOnline = Function;
        const verifyInternet = () => {
            let lastStatus = navigator.onLine;
            setInterval(() => {
                if (navigator.onLine != lastStatus) {
                    lastStatus = navigator.onLine;
                    (navigator.onLine) ? this._onOnline() : this._onOffline();
                }
            }, 1000);
        };
        verifyInternet();
    }
    onOffline(f = Function) {
        if (typeof f != 'function') throw new NetworkException('O parâmetro deve ser function.');
        this._onOffline = f;
    }
    onOnline(f = Function) {
        if (typeof f != 'function') throw new NetworkException('O parâmetro deve ser function.');
        this._onOnline = f;
    }
    sendMsg(action, config) {
        if (this._remoteIdentify) {
            const obj = {
                target: this._remoteIdentify,
                body: {
                    action: action,
                    config: config
                }
            }
            const data = JSON.stringify(obj);
            this._webSocket.send(data);
        } else {
            throw new NetworkException('Não há pareamento a nenhum alvo!')
        }
    }

    sendInvite(target, info) {
        const obj = {
            target: target,
            body: {
                action: 'pair',
                config: info
            }
        };
        const data = JSON.stringify(obj);
        this._pendingInvited = obj;
        this._timerExpireInvite = setTimeout(() => {
            this._pendingInvited = undefined;
            this._onExpiredInvite();
        }, this.EXPIREINVITE * 1000);
        this._webSocket.send(data);
        console.log('Convite enviado.');
    }
    onExpiredInvite(f = Function) {
        if (typeof f != 'function')
            throw new NetworkException('O parâmetro deve ser function.');
        this._onExpiredInvite = f;
    }

    onMsgPlayer(f = Function) {
        if (typeof f != 'function')
            throw new NetworkException('O parâmetro deve ser function.');
        this._onMsgPlayer = f;
    }
    onMsgGame(f = Function) {
        if (typeof f != 'function')
            throw new NetworkException('O parâmetro deve ser function.');
        this._onMsgGame = f;
    }
    onInvite(f = Function) {
        if (typeof f != 'function')
            throw new NetworkException('O parâmetro deve ser function.');
        this._onInvite = (info) => new Promise((resolve, reject) => {
            f(resolve, reject, info);
        });
    }

    onInvitedAwnser(f = Function) {
        if (typeof f != 'function')
            throw new NetworkException('O parâmetro deve ser function.');
        this._onInvitedAwnser = f;
    }

    onPaiered(f = Function) {
        if (typeof f != 'function')
            throw new NetworkException('O parâmetro deve ser function.');
        this._onPaiered = f;
    }

    getOrigin() {
        return this._remoteIdentify;
    }

    getIdentify() {
        return this._identify;
    }

    connect(ip) {
        this._addressServer = ip;
        return new Promise((resolve, reject) => {
            this._webSocket = new WebSocket(`${this._addressServer}?clientID=${this._identify}`);
            this._webSocket.onerror = err => reject(false);
            this._webSocket.onopen = () => {
                this._configWebSocket();
                resolve(true);
            };
        });
    }

    reconnect() {
        return new Promise((resolve, reject) => {
            if (this._webSocket.readyState == 1)
                this._webSocket.close();
            this._webSocket = undefined;
            this._webSocket = new WebSocket(`${this._addressServer}?clientID=${this._identify}`);
            this._webSocket.onerror = err => reject(false);
            this._webSocket.onopen = () => {
                this._configWebSocket();
                resolve(true);
            };
        })
    }

    /**
     * @description Verifica se está conectado ao servidor
     */
    isConnected() {
        return (this._webSocket.readyState == 1) ? true : false;
    }

    close() {
        this._webSocket.close();
    }


}

class NetworkException {
    constructor(msg) {
        this.name = 'NetworkException';
        this.message = msg;
    }
}