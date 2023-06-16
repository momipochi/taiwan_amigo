<script lang="ts" setup>
import { AmigoRoutes } from "../../routing/Routes";
import GooglePay from "../GooglePay/GooglePay.vue";

</script>

<template>
  <div id="pageContainer">
    <div class="header">
      <h1>聊天AMIGO</h1>
    </div>
    <div class="hrLine" />
    <div class="body">
      <div>
        <h2>閒閒沒事做</h2>
        <h2>找amigo聊天</h2>
      </div>
      <div>
        <h3>一起找到新的聯繫</h3>
        <h3>從聊天AMIGO開始</h3>
      </div>
    </div>

    <router-link class="beginChat" :to="AmigoRoutes.chatroom.path">
      <h2>開始閒聊</h2>
    </router-link>

    <div class="footer">
      <div id="googlePaySection">
        <h5>兩人做的一個小型項目，感謝任何幫助:)</h5>
        <GooglePay />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "./homePageStyle.scss";
</style>
