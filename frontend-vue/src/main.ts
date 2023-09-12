import { createApp } from "vue";
import "./styles/globalStyles.scss";
import App from "./App.vue";
import * as VueRouter from "vue-router";
import { AmigoRoutes } from "./routing/Routes";

const routes = [
  AmigoRoutes.homepage,
  AmigoRoutes.chatroom,
  AmigoRoutes.diagnostics,
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(router);

app.mount("#app");
