# Jogo Da Velha (PvP Online)

```
Feito em 2019. Não dou mais suporte a este projeto!   
Está no ar ainda para fins de portifólio e se alguém se interessar pode usa-lo para estudar websocket, (Só para estudar websocket mesmo, por que não me orgulho desse código 😂😂😂😂😂
```


Um dos meus primeiros projetos experimentais (PWA), clássico jogo da velha. Meu objetivo aqui foi entender como funcionava o protocolo WebSocket, para comunicação bidirecional (full duplex).

Os modelos de comunicação entre 2 ou mais dispositivos normalmente exige a reconexão com o servidor todas as vezes para consultar novas informações. Isso em aplicações escaláveis causa um aumento de tráfego, processamento e sobrecarrega no servidor, além de atraso na obtenção de informações críticas, pois o protocolo TCP exige que o processo Three-way Handshake seja realizado a cada nova conexão. Fora as demais validações que deverão ocorrer por outros protocolos acima do TCP de acordo com o modelo do Sistemas Abertos de Interconexão OSI.

Com o protocolo WebSocket é possível conectar diversos dispositivos ao servidor, e solicitar que a mesma conexão se mantenha aberta até que 1 dos correspondentes não responda em tempo hábil as requisições de status (ping), obstrução a nível físico da rede ou encerramento da comunicação por um dos correspondentes. Com a conexão aberta e permitindo troca de mensagens bidirecionais, a comunicação passa a ser orientada a eventos, permitindo que qualquer um dos correspondentes (cliente ou servidor) enviem mensagem entre si a qualquer momento

O aplicativo foi feito utilizando componentes de interface do Bootstrap, Javascript em sua programação, e a API nativa WebSocket.

Do lado do servidor foi utilizado o módulo ws, que ajuda na implementação do protocolo WebSocket sobre o HTTP e TCP em ambiente Nodejs, pois até o presente momento, esse ambiente não tem o protocolo nativamente implementado

## Para rodar local na sua máquina

`yarn ou npm install`  

`yarn start ou npm start`
