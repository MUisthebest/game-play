import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("tiles", "/assets/tiles.jpg");
    this.load.tilemapTiledJSON("map", "/assets/map.json");

    // Sprite đứng yên (idle)
    this.load.spritesheet("idle", "/assets/idle.png", {
      frameWidth: 255,
      frameHeight: 354,
    });

    // Sprite chạy (run)
    this.load.spritesheet("run", "/assets/run.png", {
      frameWidth: 261,
      frameHeight: 354,
    });
  }

  create() {
    this.scene.start("GameScene");
  }
}
