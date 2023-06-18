import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, MessageBody, SubscribeMessage, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class MyWebsocket implements OnModuleInit {
    @WebSocketServer()
    server: Server;
    public static pair = 2;
    public static queue = [];
    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id);
            console.log('connected');
        })
    }


    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any) {
        console.log(body);
        console.log(typeof (body));
        this.server.emit('onMessage', {
            msg: 'New Message',
            content: body
        });
    }

    @SubscribeMessage('queue')
    onqueue(Client: any) {
        MyWebsocket.queue.push(Client.id);
        console.log(MyWebsocket.queue)
        if (MyWebsocket.queue.length >= MyWebsocket.pair) {
            const pr = new PairRoom();
            for (let i = 0; i < MyWebsocket.pair; i++) {
                pr.sockets[i] = MyWebsocket.queue.pop();
                this.server.to(pr.sockets[i]).emit('pairup', {
                    msg: 'Pair Success!'
                })
            }
            console.log('pairup');
            console.log(pr.sockets);

        }
    }
}

class PairRoom {
    public sockets = [];
}