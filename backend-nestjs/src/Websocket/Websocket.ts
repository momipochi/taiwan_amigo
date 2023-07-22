import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, MessageBody, SubscribeMessage, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";


@WebSocketGateway({ cors: true })
export class MyWebsocket implements OnModuleInit {
    @WebSocketServer()
    server: Server;
    public static pair = 2;
    public static queue = [];
    onModuleInit() {
        this.server.on('connection', (socket: Socket) => {
            console.log(socket.id);
            this.server.to(socket.id).emit('onConnect', {
                socket: socket.id
            })
            console.log('connected');
        })
    }

    @SubscribeMessage('newQueue')
    onQueue(Client: Socket) {
        for (let i = 0; i < MyWebsocket.queue.length; i++) {
            if (MyWebsocket.queue[i].request.socket.remoteAddress == Client.request.socket.remoteAddress) {
                this.server.to(Client.id).emit('onDuplicate');
                return;
            }
        }
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
        }

    }

    @SubscribeMessage('newDescription')
    onNewDescription(client: Socket, body: any) {
        if (Object.keys(body).filter(x => x.includes("description")).length > 0) {
            client.broadcast.to(body.id).emit("onPeer", { id: body.id, description: body.description })
        }
        else if (Object.keys(body).filter(x => x.includes("candidate")).length > 0) {
            client.broadcast.to(body.id).emit("onPeer", { id: body.id, candidate: body.candidate })
        }
    }
}

class PairRoom {
    public sockets = [];
}