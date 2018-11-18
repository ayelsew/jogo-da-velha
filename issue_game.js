/**
 * @description O jogo Odds And Evens é um jogo de mão chamado também de "Par ou Impar" usado para 
 * resolver situações de solução binárias.
 * @since 1.0
 * @version 1.0
 * @param {Number} n1 Número um. Default 0.
 * @param {Number} n2 Número dois. Default 0.
 * @example 
 * const game = new OddsEvens(12,10);
 * let result = game.play(); //returns true
 * @author WesleyBU
 */
class OddsEvens {

    constructor(n1 = 0, n2 = 0) {
        this.setNumber1(n1);
        this.setNumber2(n2);
    }
    /**
     * @param {Number} v Número um.
     */
    setNumber1(v) {
        if (typeof v != 'number') throw "The value is not a number";
        this._n1 = v;
    }
    /**
     * @param {Number} v Número dois.
     */
    setNumber2(v) {
        if (typeof v != 'number') throw "The value is not a number";
        this._n2 = v;
    }
    /**
     * @param {Number} n1 Número um.
     * @param {Number} n2 Número dois.
     */
    setAllNumbers(n1, n2) {
        if (typeof n1 != 'number') throw `The param "n1" isn't a number value`;
        if (typeof n2 != 'number') throw `The param "n2" isn't a number value`;
        this._n1 = n1;
        this._n2 = n2;
    }
    /**
     * @returns Number
     */
    getNumber1() {
        return this._n1;
    }
    /**
     * @returns Number
     */
    getNumber2() {
        return this._n2;
    }
    /**
     * @description Essa função gera e retorna um número randomico entre 0 a 100.
     * @returns Number
     */
    getRandomNumber() {
        return Math.floor((Math.random() * 100) + 1);
    }
    /**
     * @description Retorna true para par ou false para impar
     * @returns Boolean
     */
    play() {
        const r = this._n1 + this._n2;
        return (r % 2 === 0) ? true : false;
    }
}
