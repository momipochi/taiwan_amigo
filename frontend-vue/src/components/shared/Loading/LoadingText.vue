<template>
  <span class="loader-text">{{text}}</span>
</template>
<script lang="ts">
export default {
  props: ["text"],
};
</script>
<style lang="scss">
@import "./loadingTextStyle.scss";
</style>
