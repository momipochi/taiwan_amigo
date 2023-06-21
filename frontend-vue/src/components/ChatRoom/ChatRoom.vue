<script setup lang="ts">
import {
  websocketClient,
  websocketState,
  wsDoSomething,
} from "./../Websocket/Websocket";
import { AmigoRoutes } from "../../routing/Routes";
import Loading from "./../shared/Loading/Loading.vue";
import LoadingText from "./../shared/Loading/LoadingText.vue";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
</script>
<template>
  <div id="chat-container">
    <div id="videostream-component">
      hi im video stream placeholder
      <div id="opponent-user-video">
        OPPONENT user video
        <video src="stream" id="remoteVid"></video>
      </div>
      <div id="this-user-video">
        THIS user video
        <video src="stream" id="myVid"></video>
      </div>
    </div>

    <div id="chat-component">
      <div id="chatbox" v-if="websocketState.connected">
        If you see this it means you're connected
        <div id="chat-window">
          <div v-for="i in dummyListOfDiscussion.length">
            <div v-bind:class="isThisClient(dummyListOfDiscussion[i - 1].name)">
              <div
                class="username"
                v-if="
                  i - 2 < 0 ||
                  dummyListOfDiscussion[i - 1].name !==
                    dummyListOfDiscussion[i - 2].name
                ">
                {{ dummyListOfDiscussion[i - 1].name }}
              </div>
              <div class="user-message">
                {{ dummyListOfDiscussion[i - 1].message }}
              </div>
              <!-- wip dont delete
              <span class="typing-text"></span>
              <span class="typing-cursor"></span> -->
            </div>
          </div>
        </div>
        <div id="messaging">
          <input
            type="text"
            placeholder="說點什麼..."
            v-on:keyup.enter="onSendMessage"
            v-model="userTypedMessage" />
          <div id="chat-buttons">
            <button id="next-person">下一個</button>
            <button>
              離開
              <router-link id="leave" :to="AmigoRoutes.homepage.path">
              </router-link>
            </button>
          </div>
        </div>
      </div>
      <div id="chatbox-loading" v-else>
        <div class="loader">
          <Loading class="circle" />
          <LoadingText class="text" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  data() {
    return {
      dummyListOfDiscussion: [
        {
          name: "路人A",
          message: "想不想看個魔術",
          typing: true,
          content: "",
        },
      ],
      clientName: "你",
      userTypedMessage: "",
      websocket: websocketClient(),
      websocketState: websocketState,
    };
  },
  mounted() {
    this.websocket.emit("queue");

    wsDoSomething(this.websocket as Socket<DefaultEventsMap, DefaultEventsMap>);
    setTimeout(() => {
      this.addNewMessage({
        name: "路人A",
        message: "選張牌",
        typing: true,
        content: "",
      });
    }, 1000);
    setTimeout(() => {
      this.addNewMessage({
        name: "你",
        message: "紅心A",
        typing: true,
        content: "",
      });
    }, 2000);
    setTimeout(() => {
      this.addNewMessage({
        name: "你",
        message: "挖好禮害",
        typing: true,
        content: "",
      });
    }, 3000);
    setTimeout(() => {
      this.addNewMessage({
        name: "路人A",
        message: "選張牌",
        typing: true,
        content: "",
      });
    }, 4000);
    setTimeout(() => {
      this.addNewMessage({
        name: "你",
        message: "紅心A",
        typing: true,
        content: "",
      });
    }, 5000);
    setTimeout(() => {
      this.addNewMessage({
        name: "你",
        message: "挖好禮害",
        typing: true,
        content: "",
      });
    }, 6000);
  },
  methods: {
    isThisClient(name: string) {
      if (name === this.clientName) {
        return "this-user-chatblock";
      }
      return "user-chatblock";
    },
    addNewMessage(newMessage: {
      name: string;
      message: string;
      typing: boolean;
      content: string;
    }) {
      this.dummyListOfDiscussion.push(newMessage);
    },
    onSendMessage() {
      if (this.userTypedMessage.trim().length > 0) {
        this.addNewMessage({
          name: this.clientName,
          message: this.userTypedMessage,
          typing: true,
          content: "",
        });
        this.userTypedMessage = "";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./chatRoomStyle.scss";
</style>
