class PlayerException {
    constructor(msg) {
        this.name = 'PlayerException';
        this.message = msg;
    }
}
class Player {
    constructor(name, marker) {
        console.log(name);
        if (typeof name != 'string')
            throw new PlayerException('O parâmetro "name" deve ser string.');
        if (typeof marker != 'string' || marker.length != 1)
            throw new PlayerException('O parâmetro "marker" deve ser string e exatamente 1 caracter.');
        this._name = name;
        this._marker = marker;
        this._prepared = false;
        this._trusted = false;
    }
    getName() {
        return this._name;
    }
    getMarker() {
        return this._marker;
    }
    isTrusted() {
        return this._trusted;
    }
    whoIAm() {
        return {
            name: this._name,
            marker: this._marker
        }
    }
    AreYouReady() {
        return new Promise((resolve, reject) => {
            resolve(true);
        })
    }
    play() {

    }
}

class PlayerLocal extends Player {
    constructor(name, marker) {
        super(name, marker);
        this._trusted = true;
    }
    AreYouReady() {
        const UI = new UserInerface();
        return new Promise((resolve, reject) => {
            UI.openModal('AreYouReady', {
                callBack: (awnser) => {
                    resolve(true);
                    this._prepared = true;
                }
            })
        })
    }
}

class PlayerOnline extends Player {
    constructor(name, marker, cnn) {
        super(name, marker);
        if (!cnn instanceof Network)
            throw new PlayerException('O parâmetro passado deve ser instancia de "Network".')
        this._cnn = cnn;
        this._hashtag = new Hashtag();
        this._cnn.onMsgPlayer((msg) => {
            switch (msg.body.config.action) {
                case 'click':
                    let elemet = this._hashtag.getElementByIndex(msg.body.config.index);
                    elemet.click();
                    break;
                default:
                    break;
            }
        })
    }
    AreYouReady() {
        return new Promise((resolve, reject) => {
            let loop = true;
            while (loop) {
                if (this._prepared) {
                    loop = false;
                    resolve(true);
                    return;
                }
            }
        });
    }
}

class PlayerBot extends Player {
    constructor(name, marker) {
        super(name, marker);
        this._hashtag = new Hashtag();
        this._getScheme = () => {
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
    }
    brain() {
        const schema = this._getScheme();
        const noob = () => {
            const cell = this._hashtag.getSchema();
            if (this._hashtag.hashIsEmpty()) {
                return 4;
            } else if (cell[0].v != '' &&
                cell[0].v != this.getMarker() &&
                cell[2].v == '' &&
                cell[6].v == '' &&
                cell[4].v == '' &&
                cell[8].v == '' || /* OU */
                cell[0].v == '' &&
                cell[2].v != this.getMarker() &&
                cell[2].v != '' &&
                cell[6].v == '' &&
                cell[4].v == '' &&
                cell[8].v == '' || /* OU */
                cell[0].v == '' &&
                cell[6].v != this.getMarker() &&
                cell[2].v == '' &&
                cell[6].v != '' &&
                cell[4].v == '' &&
                cell[8].v == '' || /* OU */
                cell[0].v == '' &&
                cell[8].v != this.getMarker() &&
                cell[2].v == '' &&
                cell[6].v == '' &&
                cell[4].v == '' &&
                cell[8].v != '') {
                return 4;
            } else {
                return undefined;
            }
        }
        const favorable = () => {
            /* Valida schema horizontal */
            let cellIndex = null;
            for (let i = 0; i <= (schema.h.length - 1); i++) {
                let r = schema.h[i];
                let match = 0;
                for (let is = 0; is <= (r.length - 1); is++) {
                    let c = r[is];
                    if (c.v == this.getMarker()) {
                        match++
                    }
                }
                if (match == 2) {
                    for (let is = 0; is <= (r.length - 1); is++) {
                        let c = r[is];
                        if (c.v == '') {
                            cellIndex = c.i
                            break;
                        }
                    }
                    break;
                }

            }
            if (cellIndex != null) {
                return cellIndex;
            }
            /* Valida schema vertical */
            cellIndex = null;
            for (let i = 0; i <= (schema.v.length - 1); i++) {
                let r = schema.v[i];
                let match = 0;
                for (let is = 0; is <= (r.length - 1); is++) {
                    let c = r[is];
                    if (c.v == this.getMarker()) {
                        match++
                    }
                }
                if (match == 2) {
                    for (let is = 0; is <= (r.length - 1); is++) {
                        let c = r[is];
                        if (c.v == '') {
                            cellIndex = c.i
                            break;
                        }
                    }
                    break;
                }

            }
            if (cellIndex != null) {
                return cellIndex;
            }
            /* Valida schema transversal */
            cellIndex = null;
            for (let i = 0; i <= (schema.t.length - 1); i++) {
                let r = schema.t[i];
                let match = 0;
                for (let is = 0; is <= (r.length - 1); is++) {
                    let c = r[is];
                    if (c.v == this.getMarker()) {
                        match++
                    }
                }
                if (match == 2) {
                    for (let is = 0; is <= (r.length - 1); is++) {
                        let c = r[is];
                        if (c.v == '') {
                            cellIndex = c.i
                            break;
                        }
                    }
                    break;
                }

            }
            if (cellIndex != null) {
                return cellIndex;
            }
            return undefined;
        }
        const unfavorable = () => {
            /* Valida schema horizontal */
            let cellIndex = null;
            for (let i = 0; i <= (schema.h.length - 1); i++) {
                let r = schema.h[i];
                let match = 0;
                for (let is = 0; is <= (r.length - 1); is++) {
                    let c = r[is];
                    if (c.v != '' && c.v != this.getMarker()) {
                        match++
                    }
                }
                if (match == 2) {
                    for (let is = 0; is <= (r.length - 1); is++) {
                        let c = r[is];
                        if (c.v == '') {
                            cellIndex = c.i
                            break;
                        }
                    }
                    break;
                }

            }
            if (cellIndex != null) {
                return cellIndex;
            }
            /* Valida schema vertical */
            cellIndex = null;
            for (let i = 0; i <= (schema.v.length - 1); i++) {
                let r = schema.v[i];
                let match = 0;
                for (let is = 0; is <= (r.length - 1); is++) {
                    let c = r[is];
                    if (c.v != '' && c.v != this.getMarker()) {
                        match++
                    }
                }
                if (match == 2) {
                    for (let is = 0; is <= (r.length - 1); is++) {
                        let c = r[is];
                        if (c.v == '') {
                            cellIndex = c.i
                            break;
                        }
                    }
                    break;
                }

            }
            if (cellIndex != null) {
                return cellIndex;
            }
            /* Valida schema transversal */
            cellIndex = null;
            for (let i = 0; i <= (schema.t.length - 1); i++) {
                let r = schema.t[i];
                let match = 0;
                for (let is = 0; is <= (r.length - 1); is++) {
                    let c = r[is];
                    if (c.v != '' && c.v != this.getMarker()) {
                        match++
                    }
                }
                if (match == 2) {
                    for (let is = 0; is <= (r.length - 1); is++) {
                        let c = r[is];
                        if (c.v == '') {
                            cellIndex = c.i
                            break;
                        }
                    }
                    break;
                }

            }
            if (cellIndex != null) {
                return cellIndex;
            }
            return undefined;
        }
        const random = () => {
            const schema = this._getScheme();
            const cell = [];
            /* Valida schema h */
            for (let i = 0; i <= (schema.h.length - 1); i++) {
                let r = schema.h[i];
                for (let is = 0; is <= (r.length - 1); is++) {
                    let c = r[is];
                    if (c.v == '') {
                        cell.push(c.i);
                    }
                }
            }
            /* Valida schema v */
            for (let i = 0; i <= (schema.v.length - 1); i++) {
                let r = schema.v[i];
                let match = 0;
                for (let is = 0; is <= (r.length - 1); is++) {
                    let c = r[is];
                    if (c.v == '') {
                        cell.push(c.i);
                    }
                }
            }
            /* Valida schema t */
            for (let i = 0; i <= (schema.t.length - 1); i++) {
                let r = schema.t[i];
                let match = 0;
                for (let is = 0; is <= (r.length - 1); is++) {
                    let c = r[is];
                    if (c.v == '') {
                        cell.push(c.i);
                    }
                }
            }

            const even = [];
            const odd = [];
            cell.forEach((i) => {
                if (i % 2 == 0) {
                    even.push(i);
                } else {
                    odd.push(i);
                }
            });
            function lottery(max) {
                let prize = undefined;
                let loop = true;
                while (loop) {
                    prize = Math.round(Math.random() * max);
                    if (prize != 0)
                        loop = false;
                }
                return --prize;
            }

            console.log('even:');
            console.log(even);
            console.log('odd:');
            console.log(odd);
            console.log('Loteria*******')
            if (even.length > 0) {
                const select = lottery(even.length);
                console.log(select);
                return even[select];
            } else {
                const select = lottery(odd.length);
                console.log(select);
                return odd[select]
            }
        }
        let choice = undefined;
        choice = noob();
        if (choice != undefined) {
            console.log('Jogada noob');
            console.log(choice);
            return choice;
        }

        choice = favorable();
        if (choice != undefined) {
            console.log('Jogada favorável');
            console.log(choice);
            return choice;
        }
        choice = unfavorable();
        if (choice != undefined) {
            console.log('Jogada não favorável');
            console.log(choice);
            return choice;
        }

        choice = random();
        console.log('Jogada randômica');
        console.log(choice);
        return choice;
    }
    play() {
        const playit = this.brain();

        const element = this._hashtag.getElementByIndex(playit);
        setTimeout(() => {
            element.click();
        }, 1700);

    }
}