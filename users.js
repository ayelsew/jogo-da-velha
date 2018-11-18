/**
 * @version 1.0
 * @since 1.0
 * @description Classe de usuário do sitema
 * @example const User1 = new User('Botuser','x');
 * @author wesleyBU
 * @requires Display
 */
class User {
    /**
     * @param {string} name Atribui nome ao usuário
     * @param {string} marker Atribui um marcador ao usuário
     */
    constructor(name = '', marker = '') {
        this._name = '';
        this._marker = '';
        this.name = name;
        this.marker = marker;
        this.trust = true;
    }
    /**
     * @param {string} v Atribui nome ao usuário.
     * @description O nome deve ser string e não pode ser vazio.
     * @example User1.name = 'Botuser';
     */
    set name(v) {
        if (typeof v != 'string') throw `O nome deve ser string.`;
        if (v.length <= 0) throw `Deve passar um nome a esse método.`;
        this._name = v;
    }
    /**
     * @param {string} v Atribui um marcador ao usuário.
     * @description O marcador deve string e apenas 1 caracter.
     * @example User1.marker = 'x';
     */
    set marker(v) {
        if (typeof v != 'string') throw `O marcador deve ser string.`;
        if (v.length > 1 && v.length <= 0) throw `O marcador deve ser um caracter!`;
        this._marker = v;
    }
    /**
     * @returns string nome
     * @example User1.name;
     */
    get name() {
        return this._name;
    }
    /**
     * @returns string marker
     * @example User1.marker;
     */
    get marker() {
        return this._marker;
    }
    play() {
        const Show = new Display('display-msg-game');
        Show.message(`Sua vez ${this.name}`);
    }
    wait() {
        const Show = new Display('display-msg-game');
        Show.message(`Espere ${this.name}`);
    }
}
/**
 * @extends User
 * @since 1.0
 * @version 1.0
 * @description Class LocaUser é usado para interagir com o usuário local no sistema.
 */
class LocalUser extends User {
    constructor(name = '', marker = '') {
        super(name, marker);
    }
}

/**
 * @description Botuser is a bot that play with user
 * @since 1.0
 * @version 1.0
 */
class BotUser extends User {
    constructor(name = '', marker = '', cellClass) {
        super(name, marker);
        if (typeof cellClass != 'string')
            throw "Botuser says: O nome da classe não é string!";
        if (!document.getElementsByClassName(cellClass))
            throw "Botuser says: Não ache a hashtag. :(";
        const cell = document.getElementsByClassName(cellClass);
        this.cell = HTMLButtonElement;
        this.schema = [
            /* Horizontais */
            [cell[0], cell[1], cell[2]],
            [cell[3], cell[4], cell[5]],
            [cell[6], cell[7], cell[8]],
            /* Verticais */
            [cell[0], cell[3], cell[6]],
            [cell[1], cell[4], cell[7]],
            [cell[2], cell[5], cell[8]],
            /* Transversais */
            [cell[0], cell[4], cell[8]],
            [cell[6], cell[4], cell[2]]
        ];
        this.trust = false;
    }

    favorable() {
        let cellF;
        for (const key in this.schema) {
            let match = 0;
            for (const cell of this.schema[key]) {
                if (cell.innerHTML == this.marker)
                    match++;
                if (match >= 2) {
                    /* console.log('Possível check mate'); */
                    let a = 0;
                    this.schema[key].forEach(e => {
                        if (e.innerHTML == '') {
                            cellF = e;
                        }
                    });
                    break;
                }
            }
            if (cellF) {
                console.log('*Jogada favorável*')
                break;
            }
        }
        this.cell = cellF;
        return cellF;
    }
    unfavorable() {
        let cellU;
        for (const key in this.schema) {
            let match = 0;
            for (const cell of this.schema[key]) {
                if (cell.innerHTML != this.marker && cell.innerHTML != '')
                    match++;
                if (match >= 2) {
                    /* console.log('Possível check mate'); */
                    let a = 0;
                    this.schema[key].forEach(e => {
                        if (e.innerHTML == '') {
                            cellU = e;
                        }
                    });
                    break;
                }
            }
            if (cellU) {
                console.log('*Jogada desfavorável*')
                break;
            }
        }
        this.cell = cellU;
        return cellU;
    }
    freePlay() {
        let cellF = [];
        console.log('* Free play *');
        for (const key in this.schema) {
            for (const cell of this.schema[key]) {
                if (cell.innerHTML == '') {
                    cellF.push(cell);
                }
            }
        }
        this.cell = cellF[this.chooseOne(cellF.length - 1)];
        console.log(this.cell);
        return this.cell;
    }
    chooseOne(range) {
        return Math.floor(Math.random() * range);
    }
    play() {
        const Show = new Display('display-msg-game');
        Show.message(`Sua vez ${this.name}`);
        setTimeout(() => {
            if (typeof this.favorable() != 'undefined') {
                console.log(this.cell);
                this.cell.click();
            } else if (typeof this.unfavorable() != 'undefined') {
                console.log(this.cell);
                this.cell.click();
            } else {
                this.freePlay();
                this.cell.click();
            }
        }, 500);

    }
}

class RemoteUser extends User {
    constructor() {
        super();
        this.trust = false
    }

}