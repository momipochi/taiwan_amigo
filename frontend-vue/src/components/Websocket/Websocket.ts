import { io } from "socket.io-client";

export const WebsocketClient = () => {
    const server = 'http://localhost:3000';
    const ws = io(server);

    ws.emit('newMessage', {
        msg: 'hey there!'
    });
    ws.on('connect', () => {
        // console.log('fucking alex');
        console.log('ws.on(\'connect\', () => {')
    });

    ws.on('onMessage', (msg: any) => {
        console.log(msg);
    });
}