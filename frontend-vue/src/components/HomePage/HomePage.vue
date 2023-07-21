<script lang="ts" setup>
import { AmigoRoutes } from "../../routing/Routes";
import GooglePay from "../GooglePay/GooglePay.vue";
import { recordNewUser } from "./../shared/TelemetryLogging/recordNewUser";
import { backgroundAnimation, nextBackgroundMode } from "./backgroundAnimation";
</script>

<template>
  <div id="pageContainer">
    <canvas id="background-animation" />
    <div id="home-content">
      <div class="header">
        <h1>聊天AMIGO</h1>
      </div>
      <div class="hrLine" />
      <div class="body-container">
        <div>
          <div class="body">
            <div>
              <h2>閒閒沒事做</h2>
              <h2>找AMIGO聊天</h2>
            </div>
            <div>
              <h3>一起找到新的聯繫</h3>
              <h3>從聊天AMIGO開始</h3>
            </div>
          </div>

          <router-link class="beginChat" :to="AmigoRoutes.chatroom.path">
            <h2>開始閒聊</h2>
          </router-link>
        </div>
        <div class="canvas-container">
          <div id="right-side-animation">
            <h1>
              <span class="typed-text">{{ typeValue }}</span>
              <span class="blinking-cursor">|</span>
              <span class="cursor" :class="{ typing: typeStatus }">&nbsp;</span>
            </h1>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <div id="background-changer" v-on:click="nextBackground">
        點我換個背景(小心會卡)
      </div>
        <div id="googlePaySection">
          <h5>兩人做的一個小型項目，感謝任何幫助:)</h5>
          <GooglePay />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  data() {
    return {
      animationText: "你好你好好好好好",
      backgroundCanvas: {} as HTMLCanvasElement,
      typeValue: "",
      typeStatus: false,
      displayTextArray: [
        "你喜歡動漫嗎",
        "喜歡運動嗎?",
        "上周的影片",
        "哈哈 真是有趣",
      ],
      typingSpeed: 100,
      erasingSpeed: 100,
      newTextDelay: 2000,
      displayTextArrayIndex: 0,
      charIndex: 0,
    };
  },
  created() {
    setTimeout(this.typeText, this.newTextDelay + 200);
  },
  async mounted() {
    this.backgroundCanvas = document.getElementById(
      "background-animation"
    ) as HTMLCanvasElement;
    backgroundAnimation(this.backgroundCanvas);
    await recordNewUser();
  },
  methods: {
    typeText() {
      if (
        this.charIndex <
        this.displayTextArray[this.displayTextArrayIndex].length
      ) {
        if (!this.typeStatus) this.typeStatus = true;
        this.typeValue += this.displayTextArray[
          this.displayTextArrayIndex
        ].charAt(this.charIndex);
        this.charIndex += 1;
        setTimeout(this.typeText, this.typingSpeed);
      } else {
        this.typeStatus = false;
        setTimeout(this.eraseText, this.newTextDelay);
      }
    },
    nextBackground() {
      nextBackgroundMode(this.backgroundCanvas);
    },
    eraseText() {
      if (this.charIndex > 0) {
        if (!this.typeStatus) this.typeStatus = true;
        this.typeValue = this.displayTextArray[
          this.displayTextArrayIndex
        ].substring(0, this.charIndex - 1);
        this.charIndex -= 1;
        setTimeout(this.eraseText, this.erasingSpeed);
      } else {
        this.typeStatus = false;
        this.displayTextArrayIndex += 1;
        if (this.displayTextArrayIndex >= this.displayTextArray.length)
          this.displayTextArrayIndex = 0;
        setTimeout(this.typeText, this.typingSpeed + 1000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./homePageStyle.scss";
</style>
