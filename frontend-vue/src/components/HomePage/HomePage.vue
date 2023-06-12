<script lang="ts" setup>
import GooglePay from "../GooglePay/GooglePay.vue";
</script>

<template>
  <div class="header">
    <h1>聊天AMIGO</h1>
    <div id="googlePaySection">
      <h5>兩人做的一個小型項目，感謝任何幫助:)</h5>
      <GooglePay />
    </div>
  </div>
  <div class="hrLine" />
  <div class="body">
    <div>
      <h2>閒閒沒事做，沒事找</h2>
      <h2>個閒著的amigo聊天</h2>
    </div>
    <div>
      <h3>一起找到新的聯繫</h3>
      <h3>從聊天AMIGO開始</h3>
    </div>
  </div>
  <div class="beginChat">
    <h2>開始閒聊</h2>
  </div>
</template>
<script lang="ts">
export default {
  components: GooglePay,
};
</script>
<style lang="scss" scoped>
@import "./homePageStyle.scss";
</style>
