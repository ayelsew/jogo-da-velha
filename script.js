/* class Scoreboard {
    constructor() {
        this.sbM0 = document.getElementById('sbM0');
        this.sbM1 = document.getElementById('sbM1');
        this.sbV0 = document.getElementById('sbV0');
        this.sbV1 = document.getElementById('sbV1');
    }
    set Label0(v) {
        this.sbM0.innerHTML = v;
    }
    set Value0(v) {
        this.sbV0.innerHTML = v;
    }
    set Label1(v) {
        this.sbM1.innerHTML = v;
    }
    set Value1(v) {
        this.sbV1.innerHTML = v;
    }
} */
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
    constructor() {
        

        const Hash = new HashTag();
        const Show = new Display('display-msg-game');
        this.Player = [
            { "user": new BotUser('Botuser One', 'X', 'cell-hash'), "score": document.getElementById('sbV0') },
            { "user": new BotUser('Velhobot', 'O', 'cell-hash'), "score": document.getElementById('sbV1')}
        ];

        Hash.click = (trust, cell) => {
            console.log('-------------------------------------------');
            if (trust == this.Player[0].user.trust) {
                Hash.cellMarker(cell, this.Player[0].user.marker);
                let match = Hash.matchSchema(this.Player[0].user.marker);
                if (match) {
                    console.log('O jogo acabou.');
                    Hash.wonStake(match);
                    Show.message(`${this.Player[0].user.name} ganhou!`);
                    this.Player[0].score.innerText ++;
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
new Game();