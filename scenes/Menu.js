export default class Menu extends Phaser.Scene {
    constructor() {
    super("Menu");
    }

    init(){

    }

    preload(){
        this.load.image("inicio"," ../public/assets/phaser3-logo.png")
    }

    create(){
        //this.pointer = this.input.activePointer;
        //this.Inicio()

        this.inicio = this.add.image(550, 300, "inicio");

        this.input.on("pointerdown", this.Inicio, this)

        this.add.text(500, 400, "TOCA Y JUGA",{
            fontSize: "45px",
            color: "#fff"
        })
    }

    Inicio(pointer){
        //if (this.pointer.isDown) {
        this.scene.start("Game")
        //}
    }
}