import Menu from "./scenes/Menu.js";
import Game from "./scenes/Game.js";
import End from "./scenes/End.js";


// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 1100,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 900,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },

  scene: [Menu, Game, End],
};
window.game = new Phaser.Game(config);
