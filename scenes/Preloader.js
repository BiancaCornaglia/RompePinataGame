export default class Preloader extends Phaser.Scene {
    constructor() {
        super("Preloader");
    }

    preload() {
        //cargar assets
        this.load.image("sky", "./public/assets/Cielo.webp");
        this.load.image("platform", "./public/assets/platform.png");
        this.load.image("girl", "../public/assets/pj04.png");
        this.load.image("rainbow", "./public/assets/piñata01.png");
        this.load.image("animal", "./public/assets/piñata02.png");
        this.load.image("star", "./public/assets/piñata03.png");
        this.load.image("boy", "./public/assets/nene01.png");
        this.load.image("mira", "./public/assets/mira.png");
        this.load.image("candy1", "./public/assets/candy1.png");
        this.load.image("candy2", "./public/assets/candy2.png");
        this.load.image("candy3", "./public/assets/candy3.png");
        this.load.image("num1", "./public/assets/num1.png");
        this.load.image("num2", "./public/assets/num2.png");
        this.load.image("num3", "./public/assets/num3.png");
    }
}