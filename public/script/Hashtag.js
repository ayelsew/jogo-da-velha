class HashtagException {
    constructor(msg) {
        this.name = 'HashtagException';
        this.message = msg;
    }
}

/**
 * @description Class usada para interagir com as celulas da hashtag
 * @version 1.0
 * @method getSchema Util para obter o status de preenchimento das celulas da hashtag
 * @method setInnerSchema Útil para aplicar valor numa celula especifica da hashtag
 * @method identifyClick Útil para verifica a localização do click na hashtag
 */
class Hashtag {
    constructor() {
        /* Coleta um array de botões (HTMLButtonElement) da hashtag */
        this._schema = document.querySelectorAll('.hashtag-cell');

        this.onClick = (target = Object, isTrusted = Boolean) => { };
        this._schema.forEach(cell => {
            cell.addEventListener('click', e => {
                if (e.target.innerHTML == '') {
                    let identifyClick = this.identifyClick(e.target);
                    let isTrusted = e.isTrusted;
                    this.onClick(identifyClick, isTrusted);
                }
            });
        });
    }
    /**
     * @description Util para obter o status de preenchimento das celulas da hashtag
     */
    getSchema() {
        let newSchema = [];
        this._schema.forEach((cell, index) => {
            newSchema.push({ "i": index, "v": cell.innerText });
        });
        return newSchema;
    }
    resetSchema() {
        this._schema.forEach(cell => {
            cell.innerHTML = ``;
        });
    }
    hashIsEmpty() {
        let r = true;
        this.getSchema().forEach(cell => {
            if (cell.v != '') {
                r = false;
                return r;
            }
        });
        return r;
    }
    hashIsFull() {
        let r = true;
        this.getSchema().forEach(cell => {
            if (cell.v == '') {
                r = false;
                return r;
            }
        });
        return r;
    }
    /**
     * @description Útil para aplicar valor numa celula especifica da hashtag
     * @param {Number} row linha na matriz 3x3
     * @param {Number} col coluna na matriz 3x3
     * @param {String} maker Caractera ser aplicado a posição localizada na relação de row e col
     */
    setInnerSchema(index, maker) {
        if (typeof index != 'number') throw new HashtagException('The value of "index" should be a integer number.');
        if (typeof maker != 'string') throw new HashtagException('The value of "maker" should be a string.');
        this._schema[index].innerText = maker;
    }
    /**
     * @description Útil para verifica a localização do click na hashtag
     * @param {Object} target Objeto (HTMLButtonElement) target do evento click 
     */
    identifyClick(target) {
        if (typeof target != 'object') throw new HashtagException('O parâmetro passado não é um objeto');
        let r = undefined;
        this._schema.forEach((cell, cellI) => {
            if (cell.tabIndex == target.tabIndex) {
                r = cellI;
            }
        });
        return (r == undefined) ? false : r;
    }

    getElementByIndex(index) {
        if (typeof index != 'number') throw new HashtagException('O parâmetro passado não é do tipo number');
        let r = undefined;
        this._schema.forEach((cell, cellI) => {
            if (cell.tabIndex == index) {
                r = cell;
            }
        });
        return r;
    }

}