<script setup lang="ts">
import {
  disconnectSocket,
  websocketClient,
  websocketState,
  websocketClientInit,
  WebsocketStateModel,
} from "./../Websocket/Websocket";
import {
  NewMessageModel,
  WebRTCModel,
  connectWebRtc,
  defaultWebRTCState,
  WebRTCStateModel,
  NewMessageModelConverted,
} from "../Websocket/WebRtc/WebRtc";
import Loading from "./../shared/Loading/Loading.vue";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

type ToggleStatus = "neutral" | "showVideo" | "showChat";
</script>

<template>
  <div v-bind:class="onStatusClassBind()" id="chat-container">
    <div id="videostream-component">
      <div id="opponent-user-video">
        <LoadingText
          text="等待中"
          class="opponent-loading"
          v-if="webRTCState.loadingOpponent" />
        <div class="opponent-left" v-if="webRTCState.opponentLeft">
          對方已離開
        </div>
        <video
          v-if="!webRTCState.loadingOpponent && !webRTCState.opponentLeft"
          autoplay
          ref="remoteVideo"
          id="remoteVid"></video>
      </div>
      <div
        id="this-user-video"
        v-on:mouseenter="hoverBtn"
        v-on:mouseleave="hoverLeaveBtn">
        <video autoplay ref="myVideo" id="myVid" muted="true"></video>
      </div>

      <DraggableMenu
        id="expandable-chat"
        :chat-is-closed="chatIsClosed"
        :chat-is-focused="chatIsFocused"
        :loading-opponent="webRTCState.loadingOpponent"
        @toggleChat="onToggleSwitch"
        @leaveRoom="leaveRoom"
        @connectWithNextUser="connectWithNextUser">
        <template v-slot:chat>
          <div id="expandable-chat-component">
            <div id="chatbox">
              <!-- If you see this it means you're connected -->
              <div id="chat-window">
                <div
                  id="pairup-notification"
                  v-if="webRTCState.pairedUpWithOpponent">
                  找到另一個AMIGO了 打個招呼!
                </div>
                <div v-else>正在幫你找AMIGO...</div>
                <div
                  v-for="i in chatLog.length"
                  v-if="webRTCState.pairedUpWithOpponent">
                  <div v-bind:class="isThisClient(chatLog[i - 1].name)">
                    <div
                      class="username"
                      v-if="
                        i - 2 < 0 || chatLog[i - 1].name !== chatLog[i - 2].name
                      ">
                      {{ chatLog[i - 1].convertedName }}
                    </div>
                    <div class="user-message">
                      {{ chatLog[i - 1].message }}
                    </div>
                  </div>
                </div>
                <div id="chatbox-loading" v-else>
                  <div class="loader">
                    <Loading class="circle" />
                    <LoadingText class="text" text="等待中" />
                  </div>
                </div>
              </div>
              <div id="messaging">
                <div id="typing-area">
                  <input
                    v-on:focus="
                      () => {
                        chatIsFocused = true;
                      }
                    "
                    v-on:blur="
                      () => {
                        chatIsFocused = false;
                      }
                    "
                    v-bind:disabled="webRTCState.loadingOpponent"
                    type="text"
                    placeholder="說點什麼..."
                    v-on:keyup.enter="onSendMessage"
                    v-model="userTypedMessage" />
                  <div
                    style="pointer-events: none; opacity: 0.85;color: #979797;"
                    v-on:click="onSendMessage"
                    v-if="webRTCState.loadingOpponent">
                    >
                  </div>
                  <div
                    style="cursor: pointer"
                    v-on:click="onSendMessage"
                    v-else>
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DraggableMenu>
    </div>

    <div id="chat-component">
      <div id="chatbox">
        <!-- If you see this it means you're connected -->
        <div id="chat-window">
          <div id="pairup-notification" v-if="webRTCState.pairedUpWithOpponent">
            找到另一個AMIGO了 打個招呼!
          </div>
          <div v-else>正在幫你找AMIGO...</div>
          <div
            v-for="i in chatLog.length"
            v-if="webRTCState.pairedUpWithOpponent">
            <div v-bind:class="isThisClient(chatLog[i - 1].name)">
              <div
                class="username"
                v-if="i - 2 < 0 || chatLog[i - 1].name !== chatLog[i - 2].name">
                {{ chatLog[i - 1].convertedName }}
              </div>
              <div class="user-message">
                {{ chatLog[i - 1].message }}
              </div>
            </div>
          </div>
          <div id="chatbox-loading" v-else>
            <div class="loader">
              <Loading class="circle" />
              <LoadingText class="text" text="等待中" />
            </div>
          </div>
        </div>
        <div id="messaging">
          <div id="typing-area">
            <input
              v-bind:disabled="webRTCState.loadingOpponent"
              type="text"
              placeholder="說點什麼..."
              v-on:keyup.enter="onSendMessage"
              v-model="userTypedMessage" />
            <div
              style="pointer-events: none; opacity: 0.85; color: #979797;"
              v-if="webRTCState.loadingOpponent">
              >
            </div>
            <div style="cursor: pointer" v-on:click="onSendMessage" v-else>
              >
            </div>
          </div>
          <div id="chat-buttons">
            <button
              v-if="webRTCState.loadingOpponent"
              id="next-person"
              style="pointer-events: none; opacity: 0.85; color: #979797;">
              下一個
            </button>
            <button
              v-else
              id="next-person"
              v-on:click="connectWithNextUser"
              style="cursor: pointer">
              下一個
            </button>
            <button v-on:click="leaveRoom">離開</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Ref, ref } from "vue";
import LoadingText from "./../shared/Loading/LoadingText.vue";
import DraggableMenu from "./draggableMenu/draggableMenu.vue";
export let myVideo: Ref<HTMLVideoElement | null> = ref(null);
export let remoteVideo: Ref<HTMLVideoElement | null> = ref(null);

export default {
  data() {
    return {
      chatIsClosed: true,
      chatIsFocused: false,
      chatLog: [] as NewMessageModelConverted[],
      clientName: Math.random().toString(),
      userTypedMessage: "",
      websocket: websocketClient(),
      websocketState: websocketState as WebsocketStateModel,
      webRTCState: defaultWebRTCState() as WebRTCStateModel,
      webrtcConneciton: {} as Promise<WebRTCModel>,
      videoHover: false,
      toggleSwitch: "neutral" as ToggleStatus,
    };
  },
  components: {
    DraggableMenu,
  },

  async beforeRouteLeave(_to, _from, next) {
    this.chatLog = [];
    this.clientName = "";
    this.userTypedMessage = "";
    this.websocket = websocketClient();
    this.websocketState = websocketState;
    this.webRTCState = defaultWebRTCState();
    this.webrtcConneciton = {} as Promise<WebRTCModel>;
    this.videoHover = false;
    this.toggleSwitch = "neutral";

    next();
  },

  async mounted() {
    if (window.innerWidth <= 924) {
      this.toggleSwitch = "showVideo";
    }
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
    this.websocket.emit("queue");
    websocketClientInit(
      this.websocket as Socket<DefaultEventsMap, DefaultEventsMap>
    );
    this.webrtcConneciton = this.newWebRTCConnection();
    this.webRTCState = (await this.webrtcConneciton).webRTCState;
    window.onbeforeunload = () => this.leaveRoom;
  },
  methods: {
    toggleChat() {
      this.chatIsClosed = !this.chatIsClosed;
    },
    onResize() {
      
      if (window.innerWidth <= 924 && this.toggleSwitch === "neutral") {
        this.toggleSwitch = "showVideo";
        this.chatIsClosed = true;
      } else if (window.innerWidth > 924) {
        this.toggleSwitch = "neutral";
        this.chatIsClosed = true;
      }
    },
    onStatusClassBind() {
      if (this.toggleSwitch === "showVideo") {
        return "vbind-chat-component";
      } else if (this.toggleSwitch === "showChat") {
        return "vbind-videostream-component";
      }
      return;
    },
    onToggleSwitch() {
      if (this.toggleSwitch === "showChat") {
        this.toggleSwitch = "showVideo";
        this.chatIsClosed = true;
      } else if (this.toggleSwitch === "showVideo") {
        this.toggleSwitch = "showChat";
        this.chatIsClosed = false;
      } else {
        this.toggleSwitch = "neutral";
        this.chatIsClosed = false;
      }
    },
    hoverBtn() {
      this.videoHover = true;
      return this.videoHover;
    },
    hoverLeaveBtn() {
      this.videoHover = false;
      return this.videoHover;
    },
    newWebRTCConnection() {
      return connectWebRtc(
        this.websocket as Socket<DefaultEventsMap, DefaultEventsMap>,
        { onMessage: this.addNewMessage }
        // this.webRTCState
      );
    },
    async leaveRoom() {
      (await this.webrtcConneciton).closeWebRtcConnection();
      disconnectSocket(
        this.websocket as Socket<DefaultEventsMap, DefaultEventsMap>
      );
    },
    connectWithUser() {
      this.websocket.emit("queue");
      websocketClientInit(
        this.websocket as Socket<DefaultEventsMap, DefaultEventsMap>
      );
      this.webrtcConneciton = this.newWebRTCConnection();
    },
    async connectWithNextUser() {
      (await this.webrtcConneciton).closeWebRtcConnection();
      // resetWebRTCState();
      // (await this.webrtcConneciton).restartRTCPeerConnection()

      this.chatLog = [];
      this.clientName = Math.random().toString();
      this.websocket.emit("newQueue");
      this.webrtcConneciton = this.newWebRTCConnection();
      this.webRTCState = (await this.webrtcConneciton).webRTCState;
    },
    isThisClient(name: string) {
      if (name === this.clientName) {
        return "this-user-chatblock";
      }
      return "user-chatblock";
    },
    addNewMessage(newMessage: NewMessageModel) {
      this.chatLog.push({
        ...newMessage,
        convertedName: newMessage.name === this.clientName ? "你" : "對方",
      });
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
        this.userTypedMessage = "";
        (await this.webrtcConneciton).sendMessage(JSON.stringify(newMessage));

        if (document.getElementById("chat-window") != null) {
          let chatwindow = document.getElementById(
            "chat-window"
          ) as HTMLElement;
          let scrollHeight = chatwindow.scrollHeight as number;
          chatwindow.scrollTop = scrollHeight;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./chatRoomStyle.scss";
</style>
