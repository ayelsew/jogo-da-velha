class UserInerface {
    constructor() {
        $('#ModalWellcome').modal('show');
        this._modal = {
            'WhoAre': {
                id: 'ModalWhoAre',
                title: (op) => {
                    return 'Identifique-se';
                },
                body: (op) => {
                    const template = `
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Name</span>
                        </div>
                        <input id="MIptName" type="text" class="form-control" maxlength="10" placeholder="Ex: WesleyBU">
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Marker</span>
                        </div>
                        <input id="MIptMarker" type="text" class="form-control" maxlength="1" placeholder="W">
                    </div>`;
                    return template;
                },
                footer: (op) => {
                    return `
                    <button id="MBtnRandomIndent" type="button" class="btn btn-info">Random</button>
                    <button id="MBtnEnterApp"type="button" class="btn btn-success">Entrar</button>
                    `
                },
                controller: (op) => {

                    $('#MBtnRandomIndent').click(() => {
                        const username = 'Player' + (Math.round(Math.random() * 1000));
                        const maeker = ['O', 'X'][Math.round(Math.random() * 1)];
                        $('#MIptName').val(username);
                        $('#MIptMarker').val(maeker);
                        $('#MBtnEnterApp').attr('disabled', '');
                        setTimeout(() => $('#MBtnEnterApp').click(), 1500);
                    });
                    $('#MBtnEnterApp').click(() => {
                        if ($('#MIptName').val() == '' || $('#MIptName').val() == ' ') {
                            this.showAlert('Digite seu nome.', 'alert-info');
                            return;
                        } else if ($('#MIptMarker').val() == '' || $('#MIptMarker').val() == ' ') {
                            this.showAlert('Qual o seu marcador?', 'alert-info');
                            return;
                        } else {
                            op.callBack(
                                $('#MIptName').val(),
                                $('#MIptMarker').val()
                            )
                            return;
                        }
                    });
                    /* hack */
                    /* const n = Math.round(Math.random() * 9);
                   setTimeout(() =>
                       op.callBack('wes' + n, `${n}`)
                       , 700);  */
                }
            },
            'AcceptInvite': {
                id: 'ModalAcceptInvite',
                title: () => {
                    return 'Convite online'
                },
                body: (op) => {
                    return `Jogar com ${op.InvitationOwner ? op.InvitationOwner : 'player'} online?`;
                },
                footer: () => {
                    return `
                    <button type="button" class="btn btn-danger" id="BtnDenyInvite">Negar</button>
                    <button type="button" class="btn btn-success" id="BtnAcceptInvite">Aceitar</button>`;
                },
                controller: (op) => {
                    let cron = 0;
                    let timer = setInterval(() => {
                        if (cron >= op.timeToAwnser) {
                            clearInterval(timer);
                            op.callBack(undefined);
                        }
                        $('#ModalAcceptInvite').find('.modal-title').html(`Convite online ${cron}|${op.timeToAwnser}Seg`)
                        cron++;
                    }, 1000);

                    $('#BtnAcceptInvite').click(() => {
                        clearInterval(timer);
                        op.callBack(true);
                    });
                    $('#BtnDenyInvite').click(() => {
                        clearInterval(timer);
                        op.callBack(false);
                    });
                }
            },
            'GameMode': {
                id: 'ModalGameMode',
                title: () => {
                    return 'Modo do jogo';
                },
                body: () => {
                    return `
                        
                        <div class="btn-group-vertical d-block">
                            <label>Contra quem quer jogar?</label>
                            <button id="BtnGameMode0" type="button" class="btn btn-primary btn-sm btn-block btn-gamemode">Online</button>
                            <button id="BtnGameMode1" type="button" class="btn btn-primary btn-sm btn-block btn-gamemode">Local</button>
                            <button id="BtnGameMode2" type="button" class="btn btn-primary btn-sm btn-block btn-gamemode">Bot</button>
                        <div>
                    `;
                },
                footer: () => {
                    return `<p>Desenvolvido por <a href="https://leydev.com.br" target="_blank">Leydev</a></p>`;
                },
                controller: (op) => {
                    $('#BtnGameMode0').click(() => {
                        op.callBack(0);
                    });
                    $('#BtnGameMode1').click(() => {
                        op.callBack(1);
                    });
                    $('#BtnGameMode2').click(() => {
                        op.callBack(2);
                    });
                    /* hack */
                    /* setTimeout(() =>
                        op.callBack(2)
                        , 1000);  */
                }
            },
            'SendInvite': {
                id: 'ModalSendInvite',
                title: () => {
                    return 'Convidar'
                },
                body: (op) => {
                    return `
                    <div class="input-group flex-nowrap">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="addon-wrapping">#ID</span>
                    </div>
                    <input id="InputMyCode" type="text" readonly class="form-control" value="${window.origin}?c=${op.myCode}">
                    <div class="input-group-append">
                        <button class="btn btn-success" type="button" id="BtnShareCode">
                            <svg x="0px" y="0px" viewBox="0 0 481.6 481.6"
                                style="enable-background:new 0 0 481.6 481.6; width: 1.5rem; fill: white;"
                                xml:space="preserve">
                                <g>
                                    <path
                                        d="M381.6,309.4c-27.7,0-52.4,13.2-68.2,33.6l-132.3-73.9c3.1-8.9,4.8-18.5,4.8-28.4c0-10-1.7-19.5-4.9-28.5l132.2-73.8   c15.7,20.5,40.5,33.8,68.3,33.8c47.4,0,86.1-38.6,86.1-86.1S429,0,381.5,0s-86.1,38.6-86.1,86.1c0,10,1.7,19.6,4.9,28.5   l-132.1,73.8c-15.7-20.6-40.5-33.8-68.3-33.8c-47.4,0-86.1,38.6-86.1,86.1s38.7,86.1,86.2,86.1c27.8,0,52.6-13.3,68.4-33.9   l132.2,73.9c-3.2,9-5,18.7-5,28.7c0,47.4,38.6,86.1,86.1,86.1s86.1-38.6,86.1-86.1S429.1,309.4,381.6,309.4z M381.6,27.1   c32.6,0,59.1,26.5,59.1,59.1s-26.5,59.1-59.1,59.1s-59.1-26.5-59.1-59.1S349.1,27.1,381.6,27.1z M100,299.8   c-32.6,0-59.1-26.5-59.1-59.1s26.5-59.1,59.1-59.1s59.1,26.5,59.1,59.1S132.5,299.8,100,299.8z M381.6,454.5   c-32.6,0-59.1-26.5-59.1-59.1c0-32.6,26.5-59.1,59.1-59.1s59.1,26.5,59.1,59.1C440.7,428,414.2,454.5,381.6,454.5z" />
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>
                <br>
                <div class="input-group mb-3">
                    <input type="text" id="CodeToInvite" class="form-control" placeholder="Cole o código aqui.">
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="button" id="BtnSendInvite">Convidar</button>
                    </div>
                </div>`;
                },
                footer: () => {
                    return `<button type="button" class="btn btn-danger" id="BtnRollBackSendInvite">Voltar</button>`;
                },
                controller: (op) => {
                    $('#BtnShareCode').click(() => {
                        this.shareContent(`${window.origin}?c=${op.myCode}`);
                    })
                    $('#BtnRollBackSendInvite').click(() => {
                        op.rollBack();
                    });
                    $('#BtnSendInvite').click(() => {
                        const code = $('#CodeToInvite').val();
                        if (code.length < 1) {
                            this.showAlert('Coloque o código', 'alert-warning');
                        } else {
                            op.callBack(code);
                        }
                    });
                }
            },
            'AreYouReady': {
                id: 'ModalAreYouReady',
                title: () => {
                    return 'Você está pronto?';
                },
                body: () => {
                    return `Está preparardo para jogar com o adversário?`;
                },
                footer: () => {
                    return `<button id="BtnGoGame" class="btn btn-success">Sim</button>`;

                },
                controller: (op) => {
                    $('#BtnGoGame').click(() => {
                        op.callBack(true);
                    })
                }
            },
            'ConfigPlayer2': {
                id: 'ModalConfigPlayer2',
                title: () => {
                    return 'Configuração do jogador 2';
                },
                body: () => {
                    return `
                    <div class="input-group mb-3">
                    <div class="input-group-append">
                        <span class="input-group-text" id="basic-addon2">Player2</span>
                    </div>
                    <input id="ConfigPlayer2" type="text" class="form-control" value="X" placeholder="ex: X ou O"
                        style="text-align: center" maxlength="1">
                    </div>`;
                },
                footer: () => {
                    return `
                    <button type="button" class="btn btn-danger" id="BtnRollBackPlayer2">Voltar</button>
                    <button type="button" class="btn btn-success" id="BtnConfigPlayer2">Jogar</button>`;
                },
                controller: (op) => {
                    $('#BtnConfigPlayer2').click(() => {
                        const val = $('#ConfigPlayer2').val();
                        if (val == '') {
                            UI.showAlert('Dê um marcador ao player2.');
                        } else {
                            op.callBack(val);
                        }
                    });
                    $('#BtnRollBackPlayer2').click(() => {
                        op.rollBack();
                    })
                }

            },
            'ConfirmThing': {
                id: 'ModalConfirmThing',
                title: () => {
                    return 'Confirmação';
                },
                body: (op) => {
                    return op.desc;
                },
                footer: () => {
                    return `
                        <button id="BtnConfirmThingCancel" class="btn btn-primary">Cancelar</button>
                        <button id="BtnConfirmThingConfirm" class="btn btn-warning">Confirma</button>
                    `
                },
                controller: (op) => {
                    $('#BtnConfirmThingConfirm').click(() => {
                        op.callBack(true);
                    });
                    $('#BtnConfirmThingCancel').click(() => {
                        op.callBack(false);
                    })
                }
            },
            'reportAnything': {
                id: 'ModalReport',
                title: () => {
                    return 'Reporte Bug, Abuso ou sugestão'
                },
                body: () => {
                    return `
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1">Descreva a baixo sugestões, bugs ou abuso de usuários.</label>
                            <textarea class="form-control" placeholder="Descreva aqui o que quer reportar. OBS: O texto deve ter no min.30 caracteres. O seu app de email padrão, será chamado para enviar a mensagem." id="TextAreaMsg" rows="10"></textarea>
                        </div>`;
                },
                footer: () => {
                    return `
                    <button id="BtnCancelarReporte" class="btn btn-danger">Cancelar</button>
                    <button id="BtnEnviarReporte" class="btn btn-success">Reportar</button>
                    `
                },
                controller: (op) => {
                    $('#BtnCancelarReporte').click(() => {
                        op.rollBack();
                    });
                    $('#BtnEnviarReporte').click(() => {
                        const msg = $('#TextAreaMsg').val();
                        if (msg == '') {
                            this.showAlert('Descreva o que deseja reportar!', 'alert-info');
                        } else if (msg.length < 30) {
                            this.showAlert('O text deve ter no minimo 30 caracteres.', 'alert-info');
                        } else {
                            op.callBack(msg);
                        }
                    });
                }
            }
        }
        this._onAction = Function;

        $('#getoutPlay').click(() => this._onAction('getoutplay'));
        $('#ReportBugOrAbuse').click(() => this._onAction('ReportBugOrAbuse'));
    }
    onAction(f = Function) {
        if (typeof f != 'function')
            throw new UIException('O parâmetro passado deve ser function.');
        this._onAction = f;
    }
    showSplashScreenLoading(text = String, cb = Function) {
        $('#waitPlayer').find('.textLoading').html(text);
        $('#waitPlayer').show('fast', cb);
    }
    closeSplashScreenLoading() {
        $('#waitPlayer').hide('fast');
    }
    openModal(name, op) {
        if (typeof this._modal[name] == 'undefined')
            throw new UIException('A modal "' + name + '" não existe.');
        let modal = this._modal[name];
        if ($(`#${modal.id}`).length < 1)
            throw new UIException('Modal não encontrada no HTML');
        $(`#${modal.id}`).find('.modal-title').html(modal.title(op));
        $(`#${modal.id}`).find('.modal-body').html(modal.body(op));
        $(`#${modal.id}`).find('.modal-footer').html(modal.footer(op));
        modal.controller(op);
        $(`#${modal.id}`).modal('show');
    }
    closeModal(name) {
        if (typeof this._modal[name] == 'undefined')
            throw new UIException('A modal "' + name + '" não existe.');
        let modal = this._modal[name];
        if ($(`#${modal.id}`).length < 1)
            throw new UIException('Modal não encontrada no HTML');
        $(`#${modal.id}`).modal('hide');
    }
    closeModalAll() {
        for (let name in this._modal) {
            let modal = this._modal[name];
            $(`#${modal.id}`).modal('hide');
        }
    }
    showAlert(txt = '', color = 'alert-info', time = 5) {
        if (typeof time != 'number')
            throw new UIException('O parâmetro "time" deve ser numérico.');
        const IDALERT = 'Alert' + (Math.round(Math.random() * 1000));
        const Template = `
            <div id="${IDALERT}" class="alert ${color} alert-dismissible fade show" style="display:none" role="alert">
                ${txt}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        $('#alertArea').append(Template);
        setTimeout(() => {
            if ($('#' + IDALERT).length > 0) {
                $('#' + IDALERT).hide('slow', () => $('#' + IDALERT).remove());
            }
        }, time * 1000);
        $('#' + IDALERT).show('fast');
    }
    displayMsg(text) {
        $('#scoreboard').html(text);
    }
    tracerHash(rule, arrayIndex = Number, array = [], time = 4) {
        const hashtag = new Hashtag();
        let newArray = [];
        let usedClass = String;
        array.forEach(c => {
            newArray.push(hashtag.getElementByIndex(c.i));
        })
        switch (rule) {
            case 'h':
                usedClass = 'won-horizontally';
                newArray.forEach(c => {
                    $(c).toggleClass('won-horizontally');
                });
                break;
            case 'v':
                usedClass = 'won-vertically';
                newArray.forEach(c => {
                    $(c).toggleClass('won-vertically');
                });
                break;
            case 't':
                if (arrayIndex == 0) {
                    usedClass = 'won-transversally-L';
                    newArray.forEach(c => {
                        $(c).toggleClass('won-transversally-L');
                    });
                } else {
                    usedClass = 'won-transversally-R';
                    newArray.forEach(c => {
                        $(c).toggleClass('won-transversally-R');
                    });
                }
                break;
            default:
                throw new UIException('O parâmetro de schema passado não existe.');
                break;
        }
        setTimeout(() => {
            newArray.forEach(c => {
                $(c).toggleClass(usedClass);
            });
        }, time * 1000);
    }
    scoreboard(m1, vm1, m2, vm2, valV) {
        $('#Score').find('.marker1').html(m1);
        $('#Score').find('.val1').html(vm1);
        $('#Score').find('.marker2').html(m2);
        $('#Score').find('.val2').html(vm2);
        $('#Score').find('.valV').html(valV);
    }
    shareContent(text) {
        $('#ModalShareContent').modal('show');
        let type = String;
        let msg = `Vamos jogar jogo da velha! ${text}`;
        $('.btn-share-icon').click(function (t) {
            type = $(this).attr('data-type');
            switch (type) {
                case 'whatsapp':
                    window.open(encodeURI(`whatsapp://send?text=${msg}`));
                    break;
                case 'telegram':
                    window.open(encodeURI(`tg://msg?text=${msg}`));
                    break;
                case 'messenger':
                    window.open(encodeURI(`fb-messenger://share?link=${msg}`));
                    break;
                case 'email':
                    window.open(encodeURI(`mailto:?subject=Vamos jogar jogo da velha?&body=${msg}`));
                default:
                    console.log('Falha ao compartilhar');
                    break;
            }
        });



    }
}

class UIException {
    constructor(msg) {
        this.name = 'UIException';
        this.message = msg;
    }
}