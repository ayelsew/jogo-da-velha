try {
    const wsc = new WebSocket('ws://localhost:8000');
    /* Connection opened */
    wsc.addEventListener('open', function (event) {
        console.log('WebSocket connected.');
    });
    /* Listen for messages */
    wsc.addEventListener('message', e => {
        console.log('Message from server ', event.data);
    });
    /* WebSocket Error */
    wsc.addEventListener('error', e => {
        console.log('Falha na comunicação do WebSocket.');
        console.log(e);
    });
    /* WebSocket closed */
    wsc.addEventListener('close', (e) => {
        console.log('WebSocket conexão fechada.');
        console.log(e);
    });
} catch (error) {
    console.log('WebSocket:');
    console.log(error);
}