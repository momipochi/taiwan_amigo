import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket, io } from "socket.io-client";

export const WebsocketClient = (): Socket<
  DefaultEventsMap,
  DefaultEventsMap
> => {
  const server = "http://localhost:3000";
  const ws = io(server);

  ws.emit("newMessage", {
    msg: "hey there!",
  });
  ws.on("connect", () => {
    console.log("ws.on('connect', () => {");
  });

  ws.on("onMessage", (msg: string) => {
    console.log(msg);
  });
  
  return ws;
};
