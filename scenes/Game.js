// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("Game");
  }

  init() {
    this.gameOver = false;
    this.timer = 10;
    this.score = 0;
    this.shapes = {
      rainbow: { points: 10, count: 0 },
      star: { points: 20, count: 0 },
      animal: { points: 30, count: 0 },
      boy: { points: -10, count: 0 },
    };
    this.isClicked = false;
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
    this.load.image("mira","../public/assets/mira.png");

  }

  create() {
    // crear elementos

    this.sky = this.add.image(550, 300, "sky");
    this.sky.setScale(3);

    this.platform = this.physics.add.staticGroup();
    this.platform.create(400, 568, "platform").setScale(4).refreshBody();

    this.girl = this.physics.add.sprite(400, 300, "girl");
    this.girl.setCollideWorldBounds(true);

    this.mira = this.physics.add.sprite(400,400, "mira");
    this.pointer = this.input.activePointer;
    this.mira.setScale(0.2)

    this.physics.add.collider(this.girl, this.platform);

    this.collectable = this.physics.add.group();

    this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    
    //this.cursor = this.input.keyboard.createCursorKeys();

    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });

    //reconocimiento del mov del mouse
    this.pointer = this.input.activePointer;

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

    this.physics.add.overlap(
      this.mira,
      this.collectable,
      this.onShapeCollect,
      null,
      this
    );

    //collider entre recolectables y plataformas
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
    if (this.a.isDown) {
      this.girl.setVelocityX(-160);
    } else if (this.d.isDown) {
      this.girl.setVelocityX(160);
    } else {
      this.girl.setVelocityX(0);
    }
    if (this.w.isDown && this.girl.body.touching.down) {
      this.girl.setVelocityY(-330);
    }

    //se mueve la mira con el mouse
    this.mira.x = this.pointer.x;
    this.mira.y = this.pointer.y;

    if (!this.pointer.isDown) {
      this.isClicked = false;
    }
  }

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

  onShapeCollect(mira, collectable) {
    if (this.pointer.isDown && !this.isClicked) {
    const nombreFig = collectable.getData("tipo");
    const points = collectable.getData("points");

    if (nombreFig == "boy") {
      console.log("guri")
    }
    else {
      this.score += points;

    this.shapes[nombreFig].count += 1;

    console.table(this.shapes);
    console.log("recolectado ", collectable.texture.key, points);
    console.log("score ", this.score);

    collectable.destroy();
    this.scoreText.setText(
      `Puntaje: ${this.score}`
    );
    }
    
    this.isClicked = true;
    }
  }



  handlerTimer() {
    this.timer -= 1;
    this.timerText.setText(`tiempo restante: ${this.timer}`);
    if (this.timer === 0) {
      this.gameOver = true;
      this.scene.start("End", {
        score: this.score,
        gameOver: this.gameOver,
      });
    }
  }

  onRecolectableBounced(collectable, platform) {
    console.log("recolectable rebote");
    let points = collectable.getData("points");
    const nombreFig = collectable.getData("tipo");
    if (nombreFig == "boy") {
      if (collectable.x > this.girl.x) {
        collectable.setVelocityX(-160);
      }
      else {
        collectable.setVelocityX(160);
      }
    }
    else {
      points -= 5;
    collectable.setData("points", points);
    if (points <= 0) {
      collectable.destroy();
    }
    }
    
  }
}
