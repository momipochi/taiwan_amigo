import { randomNumberInRangeNumber } from "../../shared/utility/random";

let backgroundMode = 0;
let animationFrame: number;
export function nextBackgroundMode(canvas: HTMLCanvasElement) {
  backgroundMode = (backgroundMode + 1) * +(backgroundMode + 1 < 2);
  // console.log(backgroundMode);
  cancelAnimationFrame(animationFrame);
  backgroundAnimation(canvas);
}
export function backgroundAnimation(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const particlesArray = generatParticles(10, context);
  setSize(canvas);
  anim(context, canvas, particlesArray);
}

function setSize(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function generatParticles(
  amount: number,
  context: CanvasRenderingContext2D
): Particle[] {
  let res: Particle[] = [];
  for (let i = 0; i < amount; i++) {
    res.push(
      new Particle(
        4,
        generateColor(),
        randomNumberInRangeNumber(0.005, 0.05),
        context
      )
    );
  }
  return res;
}

function generateColor() {
  let hexSet = "0123456789ABCDEF";
  let finalHexString = "#";
  for (let i = 0; i < 6; i++) {
    finalHexString += hexSet[Math.ceil(Math.random() * 15)];
  }
  return finalHexString;
}

function anim(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  particlesArray: Particle[]
) {
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach((particle) => particle.rotate());

  animationFrame = requestAnimationFrame(() =>
    anim(context, canvas, particlesArray)
  );
}

class Particle {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  particleTrailWidth: number;
  strokeColor: string;
  theta: number;
  rotateSpeed: number;
  t: number;
  history: { x: number; y: number; lsx: number; lsy: number }[] = [];
  constructor(
    particleTrailWidth: number,
    strokeColor: string,
    rotateSpeed: number,
    context: CanvasRenderingContext2D
  ) {
    this.context = context;
    this.particleTrailWidth = particleTrailWidth;
    this.strokeColor = strokeColor;
    this.rotateSpeed = rotateSpeed;
    this.setRotateSpeed(rotateSpeed)
    this.theta = Math.random() * Math.PI * 2;
    this.t = Math.random() * 900;
    this.x = innerWidth / 2 + Math.cos(this.theta) * this.t;
    this.y = innerHeight / 2 + Math.sin(this.theta) * this.t;
    this.history = [];
  }
  setRotateSpeed(rotateSpeed: number) {
    console.log(backgroundMode)
    switch (backgroundMode) {
      case 0:
        this.rotateSpeed = rotateSpeed;
        break;
      case 1:
        this.rotateSpeed = rotateSpeed / randomNumberInRangeNumber(0.005, 0.05);
        break;
      default:
        this.rotateSpeed = rotateSpeed;
        break;
    }
  }
  rotate() {
    const ls = {
      x: this.x,
      y: this.y,
    };
    this.x = innerWidth / 2 + Math.cos(this.theta) * this.t;
    this.y = innerHeight / 2 + Math.sin(this.theta) * this.t;
    this.history.push({ x: this.x, y: this.y, lsx: ls.x, lsy: ls.y });
    this.rotateHistory();
    if (this.history.length > 150) {
      const rect = this.history.shift();
      if (!rect) return;
    }
    this.theta += this.rotateSpeed;
    this.context.beginPath();
    this.context.lineWidth = this.particleTrailWidth;
    this.context.strokeStyle = this.strokeColor;

    this.context.moveTo(ls.x, ls.y);
    this.context.lineTo(this.x, this.y);

    this.context.stroke();
  }
  rotateHistory() {
    const numberToSubtract = this.context.globalAlpha / this.history.length;
    for (let i = this.history.length - 1; i >= 0; i--) {
      this.context.beginPath();
      this.context.lineWidth = this.particleTrailWidth;
      this.context.strokeStyle = this.strokeColor;

      this.context.moveTo(this.history[i].lsx, this.history[i].lsy);
      this.context.lineTo(this.history[i].x, this.history[i].y);

      this.context.stroke();
      this.context.closePath();
      this.context.globalAlpha -= numberToSubtract;
    }
    this.context.globalAlpha = 1;
  }
}
