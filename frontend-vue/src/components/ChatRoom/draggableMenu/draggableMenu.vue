<script setup lang="ts"></script>
<template>
  <div>
    <div
      id="mySidenav"
      class="sidenav"
      :style="{ width: chatIsClosed ? '0px' : '100%', height:chatIsFocused? '50%':'100%'}">
      <slot name="chat" class="chat-slot"></slot>
    </div>
    <div id='chat-controller'>
      <div id="next-button">
        <span
          v-if="loadingOpponent"
          id="next-person"
          style="pointer-events: none; opacity: 0.85; color: #979797;">
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
      <div class="toggle-chat">
        <span
      
        @click="$emit('toggleChat')"
        >&#xf27a&#xFE0E;/&#xf03d&#xFE0E;</span
      >
      </div>
      <div id="leave-button" style="cursor: pointer">
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
    chatIsFocused: Boolean,
    loadingOpponent: Boolean,
  },
};
</script>
<style lang="scss">
@import "./style.scss";
</style>
