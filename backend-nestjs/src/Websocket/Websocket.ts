import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, MessageBody, SubscribeMessage, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Socket } from "socket.io-client";

@WebSocketGateway({ cors: true })
export class MyWebsocket implements OnModuleInit {
    @WebSocketServer()
    server: Server;
    public static pair = 2;
    public static queue = [];
    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id);
            this.server.to(socket.id).emit('onConnect', {
                socket: socket.id
            })
            console.log('connected');
        })
    }


    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any) {
        console.log(body);
        console.log(typeof (body));
        this.server.to(body.id).emit('onMessage', {
            msg: 'New Message',
            content: body
        });
    }

    @SubscribeMessage('newQueue')
    onQueue(Client: Socket) {
        MyWebsocket.queue.push(Client);
        if (MyWebsocket.queue.length >= MyWebsocket.pair) {
            var roomID = Math.random().toString(36).substring(2, 13);
            const pr = new PairRoom();
            for (let i = 0; i < MyWebsocket.pair; i++) {
                pr.sockets[i] = MyWebsocket.queue.shift();
                pr.sockets[i].join(roomID);
            }
            this.server.to(roomID).emit('onPair', {
                id: roomID,
                msg: 'Pair Success!',
                users: pr.sockets.map(s => s.id)
            })
            console.log('pairup');
        }
    }

    @SubscribeMessage('newDescription')
    onNewDescription(@MessageBody() body: any) {
        console.log(body);
    }
}

class PairRoom {
    public sockets = [];
}