<script setup lang="ts">
import {
  disconnectSocket,
  websocketClient,
  websocketState,
  websocketClientInit,
} from "./../Websocket/Websocket";
import {
  NewMessageModel,
  WebRTCModel,
  connectWebRtc,
} from "../Websocket/WebRtc/WebRtc";
import { AmigoRoutes } from "../../routing/Routes";
import LoadingText from "./../shared/Loading/LoadingText.vue";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
let remoteBodyMessage = ref("Loading");
let counter = 0;
setInterval(LoadingPair, 1500)
function LoadingPair() {
  if (counter < 3) {
    remoteBodyMessage.value = remoteBodyMessage.value + ".";
    counter++;
  }
  else {
    remoteBodyMessage.value = "Loading"
    counter = 0;
  }
}

</script>

<template>
  <div id="chat-container">
    <div id="videostream-component">
      <div id="opponent-user-video">
        <video autoplay ref="remoteVideo" id="remoteVid"></video>
        <div id="remoteBody">{{ remoteBodyMessage }}</div>
      </div>
      <div id="this-user-video">
        <video autoplay ref="myVideo" id="myVid" muted="true"></video>
      </div>
    </div>

    <div id="chat-component">
      <div id="chatbox" v-if="websocketState.connected">
        <!-- If you see this it means you're connected -->
        <div id="chat-window">
          <div v-for="i in dummyListOfDiscussion.length">
            <div v-bind:class="isThisClient(dummyListOfDiscussion[i - 1].name)">
              <div class="username" v-if="i - 2 < 0 ||
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
          <input type="text" placeholder="說點什麼..." v-on:keyup.enter="onSendMessage" v-model="userTypedMessage" />
          <div id="chat-buttons">
            <button id="next-person" v-on:click="connectWithNextUser">
              下一個
            </button>
            <button v-on:click="leaveRoom">
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
import { Ref, ref } from "vue";
export let myVideo: Ref<HTMLVideoElement | null> = ref(null);
export let remoteVideo: Ref<HTMLVideoElement | null> = ref(null);

export default {
  data() {
    return {
      dummyListOfDiscussion: [] as NewMessageModel[],
      clientName: Math.random().toString(),
      userTypedMessage: "",
      websocket: websocketClient(),
      websocketState: websocketState,
      webrtcConneciton: {} as Promise<WebRTCModel>,

    };
  },
  mounted() {
    this.websocket.emit("queue");
    websocketClientInit(
      this.websocket as Socket<DefaultEventsMap, DefaultEventsMap>
    );
    this.webrtcConneciton = connectWebRtc(
      this.websocket as Socket<DefaultEventsMap, DefaultEventsMap>,
      { onMessage: this.addNewMessage }
    );
  },
  methods: {
    async leaveRoom() {
      (await this.webrtcConneciton).closeWebRtcConnection();
      disconnectSocket(this.websocket as Socket<DefaultEventsMap, DefaultEventsMap>);
    },
    connectWithUser() {
      this.websocket.emit("queue");
      websocketClientInit(
        this.websocket as Socket<DefaultEventsMap, DefaultEventsMap>
      );
      this.webrtcConneciton = connectWebRtc(
        this.websocket as Socket<DefaultEventsMap, DefaultEventsMap>,
        { onMessage: this.addNewMessage }
      );
    },
    async connectWithNextUser() {
      (await this.webrtcConneciton).closeWebRtcConnection();
      // (await this.webrtcConneciton).restartRTCPeerConnection()
      console.log("connecting with next user");
      this.clientName = Math.random().toString() + 'reconnect',
        this.websocket.emit("newQueue");
      this.webrtcConneciton = connectWebRtc(
        this.websocket as Socket<DefaultEventsMap, DefaultEventsMap>,
        { onMessage: this.addNewMessage }
      );
    },
    isThisClient(name: string) {
      if (name === this.clientName) {
        return "this-user-chatblock";
      }
      return "user-chatblock";
    },
    addNewMessage(newMessage: NewMessageModel) {
      this.dummyListOfDiscussion.push(newMessage);
    },
    async onSendMessage() {
      if (this.userTypedMessage.trim().length > 0) {
        const newMessage = {
          name: this.clientName,
          message: this.userTypedMessage,
          typing: true,
          content: "",
        };
        this.addNewMessage(newMessage);
        (await this.webrtcConneciton).sendMessage(JSON.stringify(newMessage));
        this.userTypedMessage = "";
      }
    },
  },
};

</script>
<style lang="scss" scoped>
@import "./chatRoomStyle.scss";
</style>
