import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("tiles", "/assets/tiles.jpg");
    this.load.image("snow", "/assets/snow.png");
    this.load.image("tree", "/assets/pine.png");
    this.load.tilemapTiledJSON("map", "/assets/map.json");

    // Sprite đứng yên (idle)
    this.load.spritesheet("idle", "/assets/idle.png", {
      frameWidth: 255,
      frameHeight: 354,
    });

    this.load.spritesheet("snowman", "/assets/yeti.png", {
      frameWidth: 256,
      frameHeight: 260,
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
