import ChatRoomVue from "../components/ChatRoom/ChatRoom.vue";
import HomePageVue from "../components/HomePage/HomePage.vue";

export const AmigoRoutes = {
  homepage: { path: "/", component: HomePageVue },
  chatroom: { path: "/chatroom", component: ChatRoomVue },
};
