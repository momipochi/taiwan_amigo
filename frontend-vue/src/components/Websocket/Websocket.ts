import { io } from "socket.io-client";
import { reactive } from "vue";

const server = "http://localhost:3000";

export const websocketState = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
});

export const websocketClient = io(server);

websocketClient.on("connect", () => {
  websocketState.connected = true;
});

websocketClient.on("disconnect", () => {
  websocketState.connected = false;
});
