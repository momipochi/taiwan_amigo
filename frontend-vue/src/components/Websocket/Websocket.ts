import { Socket, io } from "socket.io-client";
import { reactive, ref } from "vue";
import { DOMAIN_URL } from "../../shared/constants/links/links";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { router } from "../../main";
import { AmigoRoutes } from "../../routing/Routes";
export let mySocket = ref();

export interface WebsocketStateModel {
  connected: boolean;
}

export const websocketState = reactive({
  connected: false,
  loadingOpponent: true,
  opponentLeft: false,
} as WebsocketStateModel);



export const websocketClient = () => io(DOMAIN_URL);

export const websocketClientInit = (
  websocketClient: Socket<DefaultEventsMap, DefaultEventsMap>
) => {
  // websocketClient.emit("newQueue");

  websocketClient.on("disconnect", () => {
    websocketState.connected = false;
  });
  websocketClient.on("onConnect", (msg: any) => {
    websocketState.connected = true;
    mySocket.value = msg.socket;
    // var nextBtn = document.getElementById("next-person");
  });

  websocketClient.on("onDuplicate", async () => {
    alert("同一裝置不能重複配對><！");
  });
};

export const disconnectSocket = (
  websocketClient: Socket<DefaultEventsMap, DefaultEventsMap>
) => {
  router.push({ path: AmigoRoutes.homepage.path });

  websocketClient.emit("newDisconnect");
};

export const msgSend = (
  msg: string,
  roomId: string,
  websocketClient: Socket<DefaultEventsMap, DefaultEventsMap>
) => {
  websocketClient.emit("newMessage", {
    id: roomId,
    content: msg,
  });
};
