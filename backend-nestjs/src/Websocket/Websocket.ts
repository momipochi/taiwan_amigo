import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";


@WebSocketGateway({ cors: true })
export class MyWebsocket implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    public static pair = 2;
    public static queue = [];
    public static joinQueue(Client: Socket, server: Server) {
        // for (let i = 0; i < MyWebsocket.queue.length; i++) {
        //     if (MyWebsocket.queue[i].request.socket.remoteAddress == Client.request.socket.remoteAddress) {
        //         this.server.to(Client.id).emit('onDuplicate');
        //         return;
        //     }
        // }
        MyWebsocket.queue.push(Client);
        console.log(MyWebsocket.queue.length)
        if (MyWebsocket.queue.length >= MyWebsocket.pair) {
            console.log("pair success")
            var roomID = Math.random().toString(36).substring(2, 13);
            const pr = new PairRoom();
            for (let i = 0; i < MyWebsocket.pair; i++) {
                pr.sockets[i] = MyWebsocket.queue.shift();
                pr.sockets[i].join(roomID);
            }
            server.to(roomID).emit('onPair', {
                id: roomID,
                msg: 'Pair Success!',
                users: pr.sockets.map(s => s.id)
            })
        }
    }
    onModuleInit() {
        this.server.on('connection', (socket: Socket) => {
            console.log(socket.id);
            this.server.to(socket.id).emit('onConnect', {
                socket: socket.id
            })
            console.log('connected');
        })
    }
    handleDisconnect(Client: Socket) {
        for (let i = 0; i < MyWebsocket.queue.length; i++) {
            if (MyWebsocket.queue[i].request.socket.remoteAddress == Client.request.socket.remoteAddress) {
                MyWebsocket.queue.splice(i, 1);
                console.log(MyWebsocket.queue.length)
                console.log(Client.id + "is disconnected");
                Client.disconnect();
                return;
            }
        }
    }
    handleConnection(Client: Socket) {
        MyWebsocket.joinQueue(Client, this.server);
    }
    // @SubscribeMessage('newDisconnect')
    // onDisconnect(Client: Socket) {
    //     for (let i = 0; i < MyWebsocket.queue.length; i++) {
    //         if (MyWebsocket.queue[i].request.socket.remoteAddress == Client.request.socket.remoteAddress) {
    //             MyWebsocket.queue.splice(i, 1);
    //             console.log(Client.id + "is disconnected");
    //             Client.disconnect();
    //             return;
    //         }
    //     }
    // }

    @SubscribeMessage('newQueue')
    onQueue(Client: Socket) {
        MyWebsocket.joinQueue(Client, this.server);
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