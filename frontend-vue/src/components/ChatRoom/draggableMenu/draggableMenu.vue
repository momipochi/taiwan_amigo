<script setup lang="ts"></script>
<template>
  <div>
    <div
      id="mySidenav"
      class="sidenav"
      :style="{ width: chatIsClosed ? '0px' : '100%', height: '80%' }">
      <slot name="chat" class="chat-slot"></slot>
    </div>
    <div id='chat-controller'>
      <div id="next-button">
        <span
          v-if="loadingOpponent"
          id="next-person"
          style="pointer-events: none; opacity: 0.85">
          下一個
        </span>
        <span
          v-else
          id="next-person"
          @click="$emit('connectWithNextUser')"
          style="cursor: pointer">
          下一個
        </span>
      </div>
      <span
        style="font-size: 20px; cursor: pointer"
        @click="$emit('toggleChat')"
        >&#x1F4F9&#xFE0E; 切換</span
      >
      <div id="leave-button">
        <span @click="$emit('leaveRoom')">離開</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  data() {},
  props: {
    chatIsClosed: Boolean,
    loadingOpponent: Boolean,
  },
};
</script>
<style lang="scss">
@import "./style.scss";
</style>
