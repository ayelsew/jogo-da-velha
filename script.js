/**
 * @description Esse objeto é responsavel pela manipulação da hash tag do jogo.
 * @static 0.1
 * @version 1.0
 */
class HashTag {
    constructor() {
        this.cell = document.getElementsByClassName('cell-hash');
        this._cbclick = function () { };
        document.getElementById('table-hash').onclick = (e) => {
            this._cbclick(e.isTrusted, e.target);
        }
        /* Regras do jogo para ganhar */
        this.schema = [
            /* Horizontais */
            [this.cell[0], this.cell[1], this.cell[2]],
            [this.cell[3], this.cell[4], this.cell[5]],
            [this.cell[6], this.cell[7], this.cell[8]],
            /* Verticais */
            [this.cell[0], this.cell[3], this.cell[6]],
            [this.cell[1], this.cell[4], this.cell[7]],
            [this.cell[2], this.cell[5], this.cell[8]],
            /* Transversais */
            [this.cell[0], this.cell[4], this.cell[8]],
            [this.cell[6], this.cell[4], this.cell[2]]
        ]
        setTimeout(() => this.resetSchema(), 500);
    }
    fullHash() {
        let full = true;
        for (let i in this.schema) {
            for (let cell of this.schema[i]) {
                if (cell.innerHTML == '') {
                    full = false;
                    break;
                }
            }
            if (!full) break;
        }
        return full;
    }
    set click(cb) {
        if (typeof cb != 'function') throw "HashTag: the callback Click must be function.";
        this._cbclick = cb;
    }
    resetSchema() {
        for (let i in this.schema) {
            for (let cell of this.schema[i]) {
                cell.innerHTML = '';
                cell.removeAttribute('disabled');
                cell.classList.remove('won-horizontally');
                cell.classList.remove('won-vertically');
                cell.classList.remove('won-transversally-L');
                cell.classList.remove('won-transversally-R');
            }
        }
    }
    /**
     * @param {integer} p Number from possition
     */
    wonStake(p) {
        let schema = this.schema;
        function setStake(stakeP) {
            schema[p].forEach((e, i) => {
                e.classList.add(stakeP);
            })
        }
        if (p == 0 || p == 1 || p == 2) {
            setStake('won-horizontally');
        } else if (p == 3 || p == 4 || p == 5) {
            setStake('won-vertically');
        } else if (p == 6) {
            setStake('won-transversally-L');
        } else if (p == 7) {
            setStake('won-transversally-R');
        }
    }
    matchSchema(maker) {
        let index = undefined;
        for (let i = 0; i < this.schema.length; i++) {
            let match = 0;
            for (let cell of this.schema[i]) {
                if (cell.innerHTML != maker)
                    break;
                match++;
            }
            if (match == 3) {
                index = i;
                console.log('Houve ganhador.');
                break;
            }
        }
        return index;
    }
    cellMarker(cell, maker) {
        if (typeof cell != 'object') throw "A célula passada não é uma referência a célula em interface.";
        cell.setAttribute('disabled', 'true');
        cell.innerHTML = maker;
    }
}

class Display {
    constructor(id) {
        if (typeof id != 'string') throw "Display: É necessário um ID para o Display";
        if (!document.getElementById(id)) throw "Display: A interface de usuário não foi encontrada com o ID: " + id;
        this.UI = document.getElementById(id);
    }
    message(v) {
        this.UI.innerHTML = v;
    }
    textColor(v) {
        this.UI.style.color = v;
    }
    textSize(v, u = 'px') {
        if (typeof v != 'number') throw "Display.textSize: O valor deve ser númerico.";
        if (typeof u != 'string' && t.length > 3) throw "Display.textSize: A unidade de medida deve ser de até 3 caracteres."
        this.UI.style.fontSize = v + u;
    }
}

class Game {
    constructor(Player0, Player1) {

        const Hash = new HashTag();
        const Show = new Display('display-msg-game');
        document.getElementById('sbM0').innerText = Player0.marker;
        document.getElementById('sbM1').innerText = Player1.marker;
        this.Player = [
            { "user": Player0, "score": document.getElementById('sbV0') },
            { "user": Player1, "score": document.getElementById('sbV1') }
        ];
        Hash.click = (trust, cell) => {
            console.log('-------------------------------------------');
            if (trust == this.Player[0].user.trust) {
                Hash.cellMarker(cell, this.Player[0].user.marker);
                let match = Hash.matchSchema(this.Player[0].user.marker);
                if (match != undefined) {
                    console.log('O jogo acabou.');
                    Hash.wonStake(match);
                    Show.message(`${this.Player[0].user.name} ganhou!`);
                    this.Player[0].score.innerText++;
                    setTimeout(() => {
                        Hash.resetSchema()
                        this.nextPlayer();
                    }, 3000);

                } else if (Hash.fullHash()) {
                    Show.message('VELHA');
                    console.log('O jogo acabou.');
                    setTimeout(() => {
                        Hash.resetSchema()
                        this.nextPlayer();
                    }, 3000);
                } else {
                    this.moveQueue();
                    this.nextPlayer();
                }
            }
        }
        console.log('O jogo foi iniciado');
        Show.message(`${this.Player[0].user.name} você começa.`);
        this.nextPlayer();
    }
    moveQueue() {
        const LastPlayer = this.Player.splice(0, 1);
        this.Player.push(LastPlayer[0]);
        this.Player.sort();
    }
    nextPlayer() {
        this.Player[1].user.wait();
        this.Player[0].user.play();
    }
}

let TheGame;

function hiddenModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = 'none';
}
function showModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = '';
}

function startGame(op) {
    let Player0, Player1;
    switch (op) {
        case 0:
            Player0 = new LocalUser('Player1', 'x');
            Player1 = new BotUser('VelhoBot', 'B', 'cell-hash');
            TheGame = new Game(Player0, Player1);
            break;
        case 1:
            Player0 = new BotUser('BotUser', 'B', 'cell-hash');
            Player1 = new BotUser('VelhoBot', 'V', 'cell-hash');
            TheGame = new Game(Player0, Player1);
            break;
        case 2:
            Player0 = new LocalUser('Player0', 'x');
            Player1 = new LocalUser('Player1', 'o');
            TheGame = new Game(Player0, Player1);
            break;
    }
    hiddenModal('mododejogo');
}
// Registra o service worker
/* if ('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('./service-worker.js')
    .then(function() { 
        console.log('Service Worker Registered'); 
    }, function(error){
        console.error(error);
    });
} */
