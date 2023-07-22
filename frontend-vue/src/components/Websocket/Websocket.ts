import { Socket, io } from "socket.io-client";
import { Ref, reactive, ref } from "vue";
import { DOMAIN_URL } from "../../shared/constants/links/links";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { AmigoRoutes } from "../../routing/Routes";
import { RouteLocationNormalizedLoaded } from "vue-router";
export let mySocket = ref();
export const setRoute = (route: Ref<RouteLocationNormalizedLoaded>) => {
  console.log(route.value.path)
  console.log(AmigoRoutes.homepage.path)
  route.value.path = AmigoRoutes.homepage.path
}
export const websocketState = reactive({
  connected: false,
});

export const websocketClient = () => io(DOMAIN_URL);

export const websocketClientInit = (
  websocketClient: Socket<DefaultEventsMap, DefaultEventsMap>
) => {
  websocketClient.emit("newQueue");
  websocketClient.on("connect", () => {
    websocketState.connected = true;
  });
  websocketClient.on("disconnect", () => {
    websocketState.connected = false;
  });
  websocketClient.on("onConnect", (msg: any) => {
    mySocket.value = msg.socket;
  });

  websocketClient.on("onDuplicate", async () => {
    alert("duplicate");
  })
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