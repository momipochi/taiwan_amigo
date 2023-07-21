<script lang="ts" setup>
import { AmigoRoutes } from "../../routing/Routes";
import GooglePay from "../GooglePay/GooglePay.vue";
import { recordNewUser } from "./../shared/TelemetryLogging/recordNewUser";
import { sleep } from "./../../shared/utility/sleep";
import { randomNumberInRangeInt } from "./../../shared/utility/random";
import { backgroundAnimation } from "./backgroundAnimation";
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
        </div>
        <div class="canvas-container">
          <canvas id="animation"></canvas>
        </div>
      </div>

      <div class="footer">
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
      backgroundCanvas: {} as HTMLCanvasElement,
      rightSideCanvas: {} as HTMLCanvasElement,
      canvasTexts: [
        "你喜歡動漫嗎",
        "喜歡運動嗎?",
        "上周的影片",
        "哈哈 真是有趣",
      ],
    };
  },
  async mounted() {
    this.rightSideCanvas = document.getElementById(
      "animation"
    ) as HTMLCanvasElement;
    this.backgroundCanvas = document.getElementById(
      "background-animation"
    ) as HTMLCanvasElement;
    backgroundAnimation(this.backgroundCanvas);
    await this.drawRightSideCanvas();
    await recordNewUser();
  },
  methods: {
    async drawRightSideCanvas() {
      const ctx = this.rightSideCanvas.getContext("2d");
      if (!ctx) {
        return;
      }
      this.rightSideCanvas.width = window.innerWidth / 2;
      this.rightSideCanvas.height = window.innerHeight / 2;
      const width = this.rightSideCanvas.width;
      const height = this.rightSideCanvas.height;
      const rectWidth = width * 0.7;
      const rectHeight = height * 0.7;
      const rectRoundedEdge = 15;
      const rectX = (width - rectWidth) / 2;
      const rectY = (height - rectHeight) / 2;

      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.roundRect(rectX, rectY, rectWidth, rectHeight, rectRoundedEdge);
      ctx.stroke();
      ctx.closePath();
      await this.typeWrite(rectX, rectY, rectWidth, rectHeight);
    },
    async typeWrite(X: number, Y: number, width: number, height: number) {
      const fontsize = 40;
      const ctx = this.rightSideCanvas.getContext("2d");
      if (!ctx) return;
      const fps = 150;
      const index = randomNumberInRangeInt(0, this.canvasTexts.length);
      const text = this.canvasTexts[index];
      const interval = fps * text.length + 2000;
      ctx.font = `${fontsize}px HackNerd`;
      const textMeasurement = ctx.measureText(text).width;
      const adjustedY = height / 2 + fontsize;
      const adjustedX = X + (width - textMeasurement) / 2;
      await this.typeWriter(
        adjustedX,
        adjustedY,
        textMeasurement + fontsize,
        height / 2,
        fps,
        text,
        interval,
        fontsize
      );
      await sleep(interval);
      this.typeWrite(X, Y, width, height);
    },
    async typeWriter(
      X: number,
      Y: number,
      width: number,
      height: number,
      fps: number,
      text: string,
      interval: number,
      fontsize: number
    ) {
      const ctx = this.rightSideCanvas.getContext("2d");
      if (!ctx) return;
      let nextText = 0;
      setTimeout(() => ctx.clearRect(X, Y - 40, width, height), interval);
      for (let i = 0; i < text.length; i++) {
        await sleep(fps);

        ctx.fillStyle = "#000";
        ctx.font = `${fontsize}px HackNerd`;
        ctx.fillText(text[i], X + nextText, Y, width);
        nextText += fontsize;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./homePageStyle.scss";
</style>
