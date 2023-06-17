<script setup lang="ts">
import { ref, watch } from "vue";
import { WebsocketClient } from "../Websocket/Websocket";

let ws = ref(WebsocketClient());
let isConnected = ref(ws.value.connected);
console.log(isConnected.value)
watch(isConnected, async (newConnected, oldConnected) => {
  if(newConnected !== oldConnected){
    isConnected.value = ws.value.connected
  }
});
</script>
<template>
  <div>
    <div id="videostream">hi im video stream placeholder</div>
    <div id="chatbox" v-if="isConnected">Youre connected</div>
  </div>
</template>
<script lang="ts"></script>
<style lang="scss"></style>
