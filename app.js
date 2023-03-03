module.exports = class {

    constructor(netools) {
        this.MYSELF = { ident: 'SERVER' };

        if (!(netools instanceof require('./netools')))
            throw new AppException('Não foi passada uma instância de netools.');

        netools.onMessage((msg, origin) => {
            switch (msg.target) {
                case this.MYSELF.ident:
                    console.log('Para o server:' + msg.body);
                    break;
                default:
                    const target = netools.clientExist(msg.target);
                    if (typeof target === 'object') {
                        console.log('Destinatário existe');
                        console.log('Para: ' + msg.target);
                        netools.response(target, origin, msg.body);
                    } else if (target === undefined) {
                        console.log('Destinatario ausente');
                        netools.response(origin, this.MYSELF, {
                            action: 'NOTFOUND',
                            config: {
                                target: msg.target
                            }
                        });
                    }
                    break;
            }
        });
    }
}

class AppException {
    constructor(msg) {
        this.name = 'AppException';
        this.message = msg;
    }
}