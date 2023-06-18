
import { Socket, io } from "socket.io-client";


export const WebSocket = () => {
  const server = "http://localhost:3000";
  const ws = io(server);
  ws.on("connect", (client: typeof Socket) => {
    console.log("ws on");
    console.log(ws.connected);

    ws.on("onMessage", (msg: string) => {
      console.log(msg);
    });

    return client;
  });


  return ws;
}



