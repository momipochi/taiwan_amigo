export class ColorCodedMessages {
  static RedMessage(message: string) {
    console.error(`\u001b[31m${message}\u001b[0m`);
  }
  static GreenMessage(message: string) {
    console.log(`\u001b[32m${message}\u001b[0m`);
  }
}
