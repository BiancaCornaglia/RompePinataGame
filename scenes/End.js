export default class End extends Phaser.Scene {
    constructor() {
        super("End");
    }
    init(data) {
        this.score = data.score || 0;
        this.gameOver = data.gameOver || true;
    }
    create() {
        this.menu = this.add.image(550, 300, "gameover");
        this.add.text(500, 330, this.score, {
            fontSize: "40px",
            color: "#ffffff",
        }
        );

        this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update() {
        if (this.r.isDown) {
            this.scene.start("Game");
        }
    }
}
