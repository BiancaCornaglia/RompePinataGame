export default class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }

    init() {

    }

    preload() {
        this.load.image("inicio", " ./public/assets/Logo.png")
        this.load.image("sky", "./public/assets/Cielo.webp");
        this.load.image("platform", "./public/assets/suelo.png");
        this.load.image("girl", "./public/assets/girl.png");
        //this.load.image("rainbow", "./public/assets/piñata01.png");
        //this.load.image("animal", "./public/assets/piñata02.png");
        //this.load.image("star", "./public/assets/piñata03.png");
        this.load.image("boy", "./public/assets/nene01.png");
        this.load.image("mira", "./public/assets/mira.png");
        this.load.image("candy1", "./public/assets/candy1.png");
        this.load.image("candy2", "./public/assets/candy2.png");
        this.load.image("candy3", "./public/assets/candy3.png");
        this.load.image("num1", "./public/assets/num1.png");
        this.load.image("num2", "./public/assets/num2.png");
        this.load.image("num3", "./public/assets/num3.png");
        this.load.image("sugar", "./public/assets/AZUCAR.png");
        this.load.spritesheet("sugarbar", "./public/assets/sugarbar.png", { frameWidth: 300, frameHeight: 100 });
    }

    create() {
        //this.pointer = this.input.activePointer;
        //this.Inicio()

        this.inicio = this.add.image(550, 300, "inicio").setScale(0.2);

        this.input.on("pointerdown", this.Inicio, this)

        this.add.text(400, 400, "TOCA Y JUGA", {
            fontSize: "45px",
            color: "#fff"
        })
    }

    Inicio(pointer) {
        //if (this.pointer.isDown) {
        this.scene.start("Game")
        //}
    }
}