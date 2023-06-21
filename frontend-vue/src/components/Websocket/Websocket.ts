import { io } from "socket.io-client";
import { reactive } from "vue";
import { DOMAIN_URL } from "../../shared/constants/links/links";

export const websocketState = reactive({
  connected: false,
});

export const websocketClient = () => {
  return io(DOMAIN_URL);
};
