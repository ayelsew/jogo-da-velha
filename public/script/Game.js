const UI = new UserInerface();

class GameConfig {
    static getGameMode() {
        return new Promise((resolve, reject) => {
            try {
                UI.openModal('GameMode', {
                    callBack: (awnser) => {
                        resolve(awnser);
                        UI.closeModal('GameMode');
                    }
                });
            } catch (err) {
                console.log(err);
                reject(false);
            }
        })
    }
    static URIServer() { return `${/https:$/.test(document.location.protocol) ? "wss" : "ws"}://${document.location.host}` };

    static TimeToAwnserInvite() { return 14 };

    static getPlayerLocal() {
        return new Promise((resolve, reject) => {
            UI.openModal('WhoAre', {
                callBack: (name, marker) => {
                    resolve(new PlayerLocal(name, marker));
                    UI.closeModal('WhoAre');
                }
            })

        })
    }
    static getPlayerOnline(myCode) {
        return new Promise((resolve, reject) => {
            UI.openModal('SendInvite', {
                callBack: (code) => {
                    resolve(code);
                    UI.closeModal('SendInvite');
                },
                rollBack: () => {
                    reject();
                    UI.closeModal('SendInvite');
                },
                myCode: myCode
            });
        });
    }
    static getPlayerLocal2() {
        return new Promise((resolve, reject) => {
            UI.openModal('ConfigPlayer2', {
                callBack: (marker) => {
                    resolve(marker);
                },
                rollBack: () => {
                    reject();
                    UI.closeModal('ConfigPlayer2')
                }
            })
        })
    }
    static hasCodeToInvite() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('c');
    }

    static confirmThing(msg) {
        return new Promise((resolve, reject) => {
            UI.openModal('ConfirmThing', {
                callBack: (awnser) => {
                    resolve(awnser);
                    UI.closeModal('ConfirmThing');
                },
                desc: msg
            })
        })
    }

    static reportAnything() {
        return new Promise((resolve, reject) => {
            UI.openModal('reportAnything', {
                callBack: (msg) => {
                    resolve(msg);
                },
                rollBack: () => {
                    UI.closeModal('reportAnything');
                }
            })
        });
    }
}
class Game {
    constructor() {
        /* Placar de recordes */
        this._scoreBoard = Object;
        /* Interface com a hashtag */
        this._hashtag = Object;
        /* Interface coma rede */
        this._cnn = Object;
        /* Jogadores */
        this._player1 = Object;
        this._player2 = Object;
        /* Fila de jogadores */
        this._queuePlayers = Object;
        /* Um timer de escopo global */
        this._timerGlobal = Function;
        /* O primeiro da fila (É sempre o convidado) */
        this._firstOfQueue = undefined;
        const prepareGame = async () => {
            UI.showSplashScreenLoading('Carregando jogo...');
            UI.showSplashScreenLoading('Verificando internet.');
            /* Verificase tem internet */
            if (navigator.onLine) {
                UI.showSplashScreenLoading('Preparando a rede.');
                this._cnn = new Network();
                UI.showSplashScreenLoading('Conectando ao servidor...');
                if (await this._cnn.connect(GameConfig.URIServer())) {
                    UI.showAlert('Você está conectado!', 'alert-success');
                    UI.showSplashScreenLoading('Preparando para receber convites...');
                    this._cnn.onInvite((resolve, reject, info) => {
                        try {
                            UI.openModal('AcceptInvite', {
                                callBack: (awnser) => {
                                    UI.closeModal('AcceptInvite');
                                    console.log(awnser)
                                    if (awnser == undefined) {
                                        resolve({ awnser: undefined });
                                    } else if (awnser == true) {
                                        this._firstOfQueue = 0;
                                        resolve({ awnser: true, info: this._player1.whoIAm() });
                                        this.setPlayerOnline(info);
                                        UI.showAlert(`${info.name} está conectado.`, 'alert-success');
                                    } else if (awnser == false) {
                                        resolve({ awnser: false });
                                    }
                                },
                                InvitationOwner: info.name,
                                timeToAwnser: GameConfig.TimeToAwnserInvite()
                            });
                        } catch (err) {
                            reject(err);
                        }
                    });
                    this._cnn.onInvitedAwnser((awnser, info) => {
                        clearInterval(this._timerGlobal);
                        UI.closeSplashScreenLoading();
                        if (awnser) {
                            this._firstOfQueue = 1;
                            UI.showAlert(`${info.name} aceito o convite.`, 'alert-success');
                            this.setPlayerOnline(info);
                        } else {
                            this.sendInvite();
                            UI.showAlert(`O convite foi negado.`, 'alert-danger');
                        }
                    });
                    this._cnn.onMsgGame((msg) => {
                        console.log('Msg para game')
                    })
                } else {
                    UI.showAlert('Não possível conectar ao servidor!', 'alert-danger');
                    this._cnn.close();
                }
            } else {
                UI.showAlert('Sem internet!', 'alert-danger');
            }
            this._cnn.onOffline(() => {
                UI.showAlert('Você está offiline!', 'alert-danger');
                if ((this._player2 instanceof PlayerOnline)) {
                    this._hashtag.onClick = () => { }
                    this.setGameMode();
                }
            });
            this._cnn.onOnline(() => {
                UI.showAlert('A internet voltou.', 'alert-info');
                UI.showSplashScreenLoading('Conectando ao servidor...');
                this._cnn.reconnect()
                    .then(() => {
                        UI.showAlert('Você está online.', 'alert-success');
                        UI.closeSplashScreenLoading();
                    })
                    .catch(() => {
                        UI.showAlert('Não foi possível conectar.', 'alert-danger');
                    });
            })
            UI.showSplashScreenLoading('Preparando a hashtag.');
            this._hashtag = new Hashtag();
            UI.onAction((act) => {
                switch (act) {
                    case 'getoutplay':
                        GameConfig.confirmThing('Tem certeza de que quer deixar a partida?')
                            .then((awnser) => {
                                if (awnser == true) {
                                    this.setGameMode();
                                }
                            });
                        break;
                    case 'ReportBugOrAbuse':
                        GameConfig.reportAnything()
                            .then((msg) => {
                                const scheme = `mailto:wesley.waaraujo@gmail.com:?subject=Report TIC TAC TOE&body=${msg}`;
                                window.open(encodeURI(scheme));
                                console.log('uma mensagem a ser reportada');
                            })
                        break;
                    default:
                        break;
                }
            })
            if (this._cnn.isConnected) {
                UI.showSplashScreenLoading('Verificando convite.');
                const code = GameConfig.hasCodeToInvite();
                if (code != null) {
                    UI.showSplashScreenLoading('Esperando convidado.');
                    this._cnn.sendInvite(code, this._player1.whoIAm());
                    this._cnn.onExpiredInvite(() => {
                        UI.closeSplashScreenLoading();
                        UI.showAlert('O convite expirou.', 'alert-warning');
                        this.setGameMode();
                    })
                    UI.showSplashScreenLoading('Esperando convidado..');
                    /* Cronometro da animação */
                    let cron = 1;
                    this._timerGlobal = setInterval(() => {
                        if (cron >= Network.EXPIREINVITE) {
                            clearInterval(this._timerGlobal);
                            return;
                        }
                        UI.showSplashScreenLoading(`Esperando convidado... ${cron}/${Network.EXPIREINVITE}seg`);
                        cron++;
                    }, 1000)
                    UI.showSplashScreenLoading('Esperando convidado.');
                } else {
                    this.setGameMode();
                }
            } else {
                this.setGameMode();
            }

            UI.closeSplashScreenLoading();
        }

        GameConfig.getPlayerLocal()
            .then(player => {
                this._player1 = player;
                prepareGame();
            })
            .catch(err => { throw new GameException(err) });

    }
    setPlayerOnline(info) {
        UI.closeModalAll();
        this._player2 = new PlayerOnline(info.name, info.marker, this._cnn);
        this.configScoreboard();
    }
    setPlayerLocal2(info) {
        UI.closeModalAll();
        this._firstOfQueue = 0;
        this._player2 = new PlayerLocal(info.name, info.marker);
        this.configScoreboard();
    }
    setPlayerBot() {
        this._firstOfQueue = 1;
        this._player2 = new PlayerBot('Botuser', 'B');
        this.configScoreboard();
    }
    sendInvite() {
        GameConfig.getPlayerOnline(this._cnn.getIdentify())
            .then(code => {
                this._cnn.sendInvite(code, this._player1.whoIAm());
                UI.showSplashScreenLoading(`Esperando convidado... 0/${Network.EXPIREINVITE}seg`);
                UI.showAlert('Convite enviado.', 'alert-info');
                this._cnn.onExpiredInvite(() => {
                    UI.closeSplashScreenLoading();
                    UI.showAlert('O convite expirou.', 'alert-warning');
                    this.sendInvite();
                })
                /* Cronometro da animação */
                let cron = 1;
                this._timerGlobal = setInterval(() => {
                    if (cron >= Network.EXPIREINVITE) {
                        clearInterval(this._timerGlobal);
                        return;
                    }
                    UI.showSplashScreenLoading(`Esperando convidado... ${cron}/${Network.EXPIREINVITE}seg`);
                    cron++;
                }, 1000)
            })
            .catch(() => {
                this.setGameMode();
            });
    }
    setGameMode() {
        GameConfig.getGameMode()
            .then((gM) => {
                switch (parseInt(gM)) {
                    case 0:
                        console.log('Contra online');
                        this.sendInvite();
                        break;
                    case 1:
                        console.log('Contra local');
                        GameConfig.getPlayerLocal2()
                            .then((marker) => {
                                this.setPlayerLocal2({ name: 'Player2', marker: marker });
                            })
                            .catch(() => {
                                this.setGameMode();
                            });
                        break;
                    case 2:
                        console.log('Contra bot');
                        this.setPlayerBot();
                        break;
                    default:
                        console.log('Falhou');
                        console.log(gM)
                        break;
                }
            })
            .catch(err => {
                throw new GameException(err);
            })
    }

    configScoreboard() {
        const m1 = this._player1.getMarker();
        const m2 = this._player2.getMarker();
        this._scoreBoard[m1] = 0;
        this._scoreBoard[m2] = 0;
        this._scoreBoard['v'] = 0;
        const score1 = this._scoreBoard[this._player1.getMarker()];
        const score2 = this._scoreBoard[this._player2.getMarker()];
        const scoreV = this._scoreBoard['v'];
        UI.scoreboard(this._player1.getMarker(), score1, this._player2.getMarker(), score2, scoreV);
        this.start();
    }

    setPointSoreboard(marker) {
        this._scoreBoard[marker]++;
        const score1 = this._scoreBoard[this._player1.getMarker()];
        const score2 = this._scoreBoard[this._player2.getMarker()];
        const scoreV = this._scoreBoard['v'];
        UI.scoreboard(this._player1.getMarker(), score1, this._player2.getMarker(), score2, scoreV);
    }
    getSchemaHashtag() {
        const c = this._hashtag.getSchema();
        return {
            h: [
                [c[0], c[1], c[2]],
                [c[3], c[4], c[5]],
                [c[6], c[7], c[8]]
            ],
            v: [
                [c[0], c[3], c[6]],
                [c[1], c[4], c[7]],
                [c[2], c[5], c[8]]
            ],
            t: [
                [c[0], c[4], c[8]],
                [c[2], c[4], c[6]]
            ]
        }
    }

    makeQueue() {
        if (this._firstOfQueue == 0) {
            this._queuePlayers = [this._player1, this._player2];
        } else {
            this._queuePlayers = [this._player2, this._player1];
        }
    }

    pushQueue() {
        this._queuePlayers = [this._queuePlayers[1], this._queuePlayers[0]];
    }

    hasWinner(marker) {
        const schema = this.getSchemaHashtag();
        let rul = Object, rulIndex = Number, win = Boolean;
        /* Valida schema horizontal */
        for (let i = 0; i <= (schema.h.length - 1); i++) {
            let r = schema.h[i];
            win = true;
            rul = r;
            rulIndex = i;
            for (let is = 0; is <= (r.length - 1); is++) {
                let c = r[is];
                if (c.v != marker) {
                    win = false;
                    break;
                }
            }
            if (win)
                break;
        }
        if (win)
            return { sch: 'h', rulI: rulIndex, rul: rul };

        /* Valida schema vertical */
        for (let i = 0; i <= (schema.v.length - 1); i++) {
            let r = schema.v[i];
            win = true;
            rul = r;
            rulIndex = i;
            for (let is = 0; is <= (r.length - 1); is++) {
                let c = r[is];
                if (c.v != marker) {
                    win = false;
                    break;
                }
            }
            if (win)
                break;
        }
        if (win)
            return { sch: 'v', rulI: rulIndex, rul: rul };

        /* Valida schema transversal */
        for (let i = 0; i <= (schema.t.length - 1); i++) {
            let r = schema.t[i];
            win = true;
            rul = r;
            rulIndex = i;
            for (let is = 0; is <= (r.length - 1); is++) {
                let c = r[is];
                if (c.v != marker) {
                    win = false;
                    break;
                }
            }
            if (win)
                break;
        }
        if (win)
            return { sch: 't', rulI: rulIndex, rul: rul };
        return undefined;
    }

    start() {
        this._hashtag.resetSchema();
        this.makeQueue();
        let playerNow = this._queuePlayers[0];
        /* Reporta a jogada do player local para o player remoto */
        const reportClickToRemote = (click) => {
            if ((this._player2 instanceof PlayerOnline))
                this._cnn.sendMsg('player', { action: 'click', index: click });
        }
        const nextPLayer = () => {
            this.pushQueue();
            playerNow = this._queuePlayers[0];
            if (playerNow instanceof PlayerLocal) {
                UI.displayMsg('Sua vez.');
            } else {
                UI.displayMsg(`É vez de ${playerNow.getName()}`);
            }

        }
        UI.displayMsg(`O convidado começa.`);
        console.log(playerNow);
        setTimeout(() => {
            playerNow.play();
        }, 1000)

        let playable = true;
        this._hashtag.onClick = (target, trusted) => {
            if (playable) {
                if (playerNow.isTrusted() == trusted) {
                    window.navigator.vibrate([100, 0]);
                    this._hashtag.setInnerSchema(target, playerNow.getMarker());
                    if (!(playerNow instanceof PlayerOnline))
                        reportClickToRemote(target);
                    let hasWinner = this.hasWinner(playerNow.getMarker());
                    /* Verifica se o player atual ganhou */
                    if (typeof hasWinner == 'object') {
                        window.navigator.vibrate([100, 200, 100, 100, 1000]);
                        playable = false;
                        UI.showAlert(`${playerNow.getName()} venceu.`, 'alert-success');
                        UI.tracerHash(hasWinner.sch, hasWinner.rulI, hasWinner.rul, 2);
                        this.setPointSoreboard(playerNow.getMarker());
                        setTimeout(() => {
                            playable = true;
                            UI.displayMsg('O vencedor continua.');
                            this._hashtag.resetSchema();
                            playerNow.play();
                        }, 2000);
                        return;
                    }

                    if (this._hashtag.hashIsFull()) {
                        playable = false;
                        this.setPointSoreboard('v');
                        UI.displayMsg('Deu velha.');
                        setTimeout(() => {
                            this._hashtag.resetSchema();
                            nextPLayer();
                            playable = true;
                            playerNow.play();
                        }, 4000);
                        return;
                    }
                    nextPLayer();
                    playerNow.play();
                } else {
                    navigator.vibrate([200, 200])
                    UI.showAlert(`${this._queuePlayers[1].getName()} espere suavez!`, 'alert-warning');
                }
            }
        }
    }

}



class GameException {
    constructor(msg) {
        this.name = 'GameException';
        this.message = msg;
    }
}

const g = new Game();

/* let ws = new WebSocket('ws://localhost:3333?clientID=123y74r7rg47');

ws.onopen = () => console.log('WS Open');
ws.onerror = () => console.log('WS Error');
ws.onclose = () => console.log('WS Close');
ws.onmessage = m => console.log(m); */