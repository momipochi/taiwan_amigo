<script setup lang="ts">
import { baseFetch } from "../../shared/api/baseFetchApi/baseFetchApi";
</script>
<template>
  <div>
    <div>
      <input
        v-model="content"
        type="text"
        v-on:keyup.enter="async () => await sendContent()" />
    </div>
    <div>
      <p>
        {{ answer }}
      </p>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  data() {
    return {
      content: "",
      answer: "" as any,
    };
  },
  methods: {
    async sendContent() {
      const response = await baseFetch(this.content, "GET");
      if (!response) {
        this.answer = "¯\_(ツ)_/¯"
        return;
      }
      this.answer = await response.json();
    },
  },
};
</script>
<style lang=""></style>
