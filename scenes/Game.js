// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("main");
  }

  init() {
    this.gameOver = false;
    this.timer = 30;
    this.score = 0;
    this.shapes = {
      rainbow: { points: 10, count: 0 },
      star: { points: 20, count: 0 },
      animal: { points: 30, count: 0 },
      boy: { points: -10, count: 0 },
    };
  }

  preload() {
   //cargar assets

    this.load.image("sky", "../public/assets/Cielo.webp");
    this.load.image("platform", "../public/assets/platform.png");
    this.load.image("girl", "../public/assets/pj04.png");
    this.load.image("rainbow", "../public/assets/piñata01.png");
    this.load.image("animal", "../public/assets/piñata02.png");
    this.load.image("star", "../public/assets/piñata03.png");
    this.load.image("boy", "../public/assets/nene01.png");
  }

  create() {
    // crear elementos

    this.sky = this.add.image(550, 300, "sky");
    this.sky.setScale(3);

    this.platform = this.physics.add.staticGroup();
    this.platform.create(400, 568, "platform").setScale(4).refreshBody();
    this.platform.create(100, 350, "platform");
    this.platform.create(1000, 350, "platform");

    this.girl = this.physics.add.sprite(400, 300, "girl");
    this.girl.setCollideWorldBounds(true);

    this.physics.add.collider(this.girl, this.platform);

    this.collectable = this.physics.add.group();

    //this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    //this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    //this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    //this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    //crear teclas
    this.cursor = this.input.keyboard.createCursorKeys();

    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });

    //reconocimiento del mov del mouse
    //this.pointer = this.input.activePointer;

    //se mueve la mira con el mouse
    //this.mira.x = this.pointer.x;
    //this.mira.y = this.pointer.y;

    // evento 1 segundo
    this.time.addEvent({
      delay: 1000,
      callback: this.handlerTimer,
      callbackScope: this,
      loop: true,
    });

    //agregar texto de timer
    this.timerText = this.add.text(10, 10, `tiempo restante: ${this.timer}`, {
      fontSize: "32px",
      fill: "#fff",
    });

    this.scoreText = this.add.text(
      10,
      50,
      `Puntaje: ${this.score}`
    );

    //collider entre recolectables y personaje
    this.physics.add.collider(
      this.girl,
      this.collectable,
      this.onShapeCollect,
      null,
      this
    );

    // collider entre recolectables y plataformas
    this.physics.add.collider(
      this.collectable,
      this.platform,
      this.onRecolectableBounced,
      null,
      this
    );
  }

  update() {
    if (this.gameOver && this.r.isDown) {
      this.scene.restart();
    }
    if (this.gameOver) {
      this.physics.pause();
      this.timerText.setText("Game Over");
      return;
    }
    // movimiento personaje
    if (this.cursor.left.isDown) {
      this.girl.setVelocityX(-160);
    } else if (this.cursor.right.isDown) {
      this.girl.setVelocityX(160);
    } else {
      this.girl.setVelocityX(0);
    }
    if (this.cursor.up.isDown && this.girl.body.touching.down) {
      this.girl.setVelocityY(-330);
    }
  }

  //Recolect(_mira, collectable){
    //if (this.pointer.isDowm){
    //const nombreFig = collectable.getData("tipo");
    //  const puntosFig = collectable.getData("points")

    //  this.score += puntosFig;
      //const points = collectable.getData("points");

      //this.shapes [nombreFig].count += 1;

//      console.table(this.shapes);
  //    console-log("score", this.score);

    //  this.textScore.setText(
      //  `${this.score}`)
      
     // collectable.destroy()

    //}
 // }

  onSecond() {
    if (this.gameOver) {
      return;
    }

    const tipos = ["rainbow", "animal", "star", "boy"];

    const tipo = Phaser.Math.RND.pick(tipos);
    let collectable = this.collectable.create(
      Phaser.Math.Between(10, 790),
      0,
      tipo
    );
    collectable.setVelocity(0, 100);

    //asignar rebote: busca un numero entre 0.4 y 0.8
    const rebote = Phaser.Math.FloatBetween(0.4, 0.8);

    //set data
    collectable.setData("points", this.shapes[tipo].points);
    collectable.setData("tipo", tipo);
  }

  onShapeCollect(girl, collectable) {
    const nombreFig = collectable.getData("tipo");
    const points = collectable.getData("points");

    this.score += points;

    this.shapes[nombreFig].count += 1;

    console.table(this.shapes);
    console.log("recolectado ", collectable.texture.key, points);
    console.log("score ", this.score);
    collectable.destroy();
    //recolectable.disableBody(true, true);

    this.scoreText.setText(
      `Puntaje: ${this.score}
        T: ${this.shapes["rainbow"].count}
        C: ${this.shapes["animal"].count}
        R: ${this.shapes["star"].count}`
    );
  }

  handlerTimer() {
    this.timer -= 1;
    this.timerText.setText(`tiempo restante: ${this.timer}`);
    if (this.timer === 0) {
      this.gameOver = true;
      this.scene.start("end", {
        score: this.score,
        gameOver: this.gameOver,
      });
    }
  }

  onRecolectableBounced(collectable, platform) {
    console.log("recolectable rebote");
    let points = collectable.getData("points");
    points -= 5;
    collectable.setData("points", points);
    if (points <= 0) {
      collectable.destroy();
    }
  }
}
