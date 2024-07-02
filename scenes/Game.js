export default class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init() {
    this.gameOver = false;
    this.timer = 50;
    this.score = 0;
    this.shapes = {
      num1: { points: 0 },
      num2: { points: 0 },
      num3: { points: 0 },
      boy: { points: -20 },
    };
    this.isClicked = false;
    this.candys = {
      candy1: { points: 30 },
      candy2: { points: 20 },
      candy3: { points: 10 },
    };
  }

  create() {
    // crear elementos

    this.sky = this.add.image(550, 300, "sky");

    this.platform = this.physics.add.staticGroup();
    this.platform.create(550, 550, "platform").refreshBody();

    //this.sugar = this.physics.add.staticGroup();
    //this.sugar.create(920, 80, "sugar");

    this.add.sprite(920, 80, "sugarbar");

    this.girl = this.physics.add.sprite(550, 300, "girl");
    this.girl.setCollideWorldBounds(true);
    this.girl.setGravity(0, 800);

    this.mira = this.physics.add.sprite(400, 400, "mira");
    this.pointer = this.input.activePointer;

    this.physics.add.collider(this.girl, this.platform);

    this.collectable = this.physics.add.group();

    this.candy = this.physics.add.group();

    this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("girlmove", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: 0,
  });

  this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("girljump", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: 0,
  });

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

    this.scoreText = this.add.text(10, 50, `Puntaje: ${this.score}`);

    //collider entre recolectables y personaje
    this.physics.add.overlap(
      this.girl,
      this.collectable,
      this.onGirlCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.girl,
      this.candy,
      this.GirlCandyCollision,
      null,
      this
    );

    //overlap entre collectable y mira
    this.physics.add.overlap(
      this.mira,
      this.collectable,
      this.onShapeCollect,
      null,
      this
    );

    //overlap entre caramelos y nenes
    this.physics.add.overlap(
      this.candy,
      this.collectable,
      this.boyCollectsCandy,
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

    //collider entre candy y plataformas
    this.physics.add.collider(
      this.candy,
      this.platform,
      this.CandyPerreo,
      null,
      this
    );

    this.cooling = false;
    this.cooldown = 0;
  }

  update(deltatime) {

    // movimiento personaje
    if (this.a.isDown) {
      this.girl.setVelocityX(-160);
    } else if (this.d.isDown) {
      this.girl.setVelocityX(160);
    } else {
      this.girl.setVelocityX(0);
    }

    if ((this.w.isDown && this.girl.body.touching.down) || (this.spacebar.isDown && this.girl.body.touching.down)) {
      this.girl.setVelocityY(-500);
    }

    if (this.a.isDown && this.girl.body.touching.down) {
      this.girl.anims.play("walk", true);
      this.girl.flipX = false;
    } else if (this.d.isDown && this.girl.body.touching.down) {
      this.girl.anims.play("walk", true);
      this.girl.flipX = true;
    } else if (this.w.isDown) {
      this.girl.anims.play("jump", true);
      this.girl.flipX = true;
    }

    //se mueve la mira con el mouse
    this.mira.x = this.pointer.x;
    this.mira.y = this.pointer.y;

    if (!this.pointer.isDown) {
      this.isClicked = false;
    }

    if (this.cooling) {
      let deltaInSeconds = deltatime / 1000;
      this.cooldown += deltaInSeconds;
      if (this.cooldown >= 1000) {
        this.cooling = false;
        this.cooldown = 0;
      }
    }
    if (this.timer > 50) {
      this.timer = 50;
      this.timerText.setText(`tiempo restante: ${this.timer}`);
    }
    if (this.gameOver) {
      this.scene.start("End", {
        score: this.score,
        gameOver: this.gameOver,
      });
    }
  }

  onSecond() {
    if (this.gameOver) {
      return;
    }

    const tipos = ["num1", "num2", "num3", "boy"];

    const tipo = Phaser.Math.RND.pick(tipos);
    let collectable = this.collectable.create(
      Phaser.Math.Between(50, 1050),
      0,
      tipo
    );
    collectable.setVelocity(0, 200);

    //asignar rebote: busca un numero entre 0.4 y 0.8
    const rebote = Phaser.Math.FloatBetween(0.4, 0.8);

    //set data
    collectable.setData("points", this.shapes[tipo].points);
    collectable.setData("tipo", tipo);
    if (collectable.getData("tipo", tipo) == "num1") {
      collectable.setData("hp", 1);
    } else if (collectable.getData("tipo", tipo) == "num2") {
      collectable.setData("hp", 2);
    } else if (collectable.getData("tipo", tipo) == "num3") {
      collectable.setData("hp", 3);
    }
  }

  onShapeCollect(mira, collectable) {
    if (this.pointer.isDown && !this.isClicked) {
      const nombreFig = collectable.getData("tipo");
      const points = collectable.getData("points");

      if (nombreFig == "boy") {
        this.score += points;
        this.scoreText.setText(`Puntaje: ${this.score}`);
        this.timer = this.timer - 10;
        this.timerText.setText(`tiempo restante: ${this.timer}`);
        if (this.timer <= 0) {
          this.timer = 0;
          this.timerText.setText(`tiempo restante: ${this.timer}`);
          this.gameOver = true;
        }
      } else {
        if (collectable.getData("hp") == "3") {
          collectable.setData("hp", 2);
          collectable.setTexture("num2");
        } else if (collectable.getData("hp") == "2") {
          collectable.setData("hp", 1);
          collectable.setTexture("num1");
        } else if (collectable.getData("hp") == "1") {
          collectable.setData("hp", 0);
          collectable.destroy();
          const candyList = ["candy1", "candy2", "candy3"];
          const candyNum = Phaser.Math.RND.pick(candyList);
          let candy = this.candy.create(collectable.x, collectable.y, candyNum);
          candy.setVelocity(0, 350);
          candy.setData("points", this.candys[candyNum].points);
        }
      }

      this.isClicked = true;
    }
  }

  handlerTimer() {
    this.timer -= 1;
    this.timerText.setText(`tiempo restante: ${this.timer}`);
    if (this.timer <= 0) {
      this.timer = 0;
      this.gameOver = true;
    }
  }

  onRecolectableBounced(collectable, platform) {
    console.log("recolectable rebote");
    let points = collectable.getData("points");
    const nombreFig = collectable.getData("tipo");
    if (nombreFig == "boy") {
      if (collectable.x > this.girl.x) {
        collectable.setVelocityX(-260);
        collectable = !this.collectable;
      } else {
        collectable.setVelocityX(260);
        collectable = !this.collectable;
      }
    } else {
      collectable.destroy();
    }
  }

  onGirlCollision(timer, collectable) {
    const nombreFig = collectable.getData("tipo");
    if (nombreFig == "boy" && !this.cooling) {
      this.timer = this.timer - 10;
      this.timerText.setText(`tiempo restante: ${this.timer}`);
      this.cooling = true;
      if (this.timer <= 0) {
        this.gameOver = true;
        this.timer = 0;
        this.timerText.setText(`tiempo restante: ${this.timer}`);
      }
    } else {
      //no pasa nada, ya los desaparece el piso
    }
  }

  GirlCandyCollision(timer, candy) {
    const points = candy.getData("points");
    this.score += points
    this.scoreText.setText(`Puntaje: ${this.score}`);
    this.timer = this.timer + 5;
    this.timerText.setText(`tiempo restante: ${this.timer}`);
    candy.destroy();
  }

  boyCollectsCandy(candy, collectable) {
    const nombreFig = collectable.getData("tipo");
    if (nombreFig == "boy") {
      candy.destroy();
    } else {
    }
  }

  CandyPerreo() { }
}