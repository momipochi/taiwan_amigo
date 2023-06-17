<script setup lang="ts">
import { ref, watch } from "vue";
import { WebsocketClient } from "../Websocket/Websocket";

const ws = ref(WebsocketClient());
const isConnected = ref(false);
ws.value.on("connect", () => {
  isConnected.value = true;
  console.log("yo wassup im fucking connected ", isConnected.value);
});
console.log(isConnected.value);
watch(isConnected, async () => {
  isConnected.value = ws.value.connected;
});
console.log("am i tho? ", isConnected.value);
</script>
<template>
  <div id="chat-container">
    <div id="videostream-component">
      hi im video stream placeholder
      <div id="opponent-user-video">
        OPPONENT user video
        <video src="stream"></video>
      </div>
      <div id="this-user-video">
        THIS user video
        <video src="stream"></video>
      </div>
    </div>

    <div id="chat-component">
      <div id="chatbox" v-if="isConnected">
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
          <input type="text" placeholder="說點什麼..." />
          <div id="chat-buttons">
            <button id="next-person">下一個 (暫用)</button>
            <button id="leave">離開 (暫用)</button>
          </div>
        </div>
      </div>
      <div id="chatbox-loading" v-else>Chat conneciton loading...</div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  data() {
    return {
      dummyListOfDiscussion: [
        {
          id: 1,
          name: "路人A",
          message: "想不想看個魔術",
          typing: true,
          content: "",
        },
      ],
      clientName: "你",
    };
  },
  mounted() {
    setTimeout(() => {
      this.addNewMessage({
        id: 2,
        name: "路人A",
        message: "選張牌",
        typing: true,
        content: "",
      });
    }, 1000);
    setTimeout(() => {
      this.addNewMessage({
        id: 3,
        name: "你",
        message: "紅心A",
        typing: true,
        content: "",
      });
    }, 2000);
    setTimeout(() => {
      this.addNewMessage({
        id: 4,
        name: "你",
        message: "挖好禮害",
        typing: true,
        content: "",
      });
    }, 3000);
    setTimeout(() => {
      this.addNewMessage({
        id: 2,
        name: "路人A",
        message: "選張牌",
        typing: true,
        content: "",
      });
    }, 4000);
    setTimeout(() => {
      this.addNewMessage({
        id: 3,
        name: "你",
        message: "紅心A",
        typing: true,
        content: "",
      });
    }, 5000);
    setTimeout(() => {
      this.addNewMessage({
        id: 4,
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
      id: number;
      name: string;
      message: string;
      typing: boolean;
      content: string;
    }) {
      this.dummyListOfDiscussion.push(newMessage);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./chatRoomStyle.scss";
</style>
