import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("tiles", "/assets/tiles.jpg");
    this.load.image("snow", "/assets/snow.png");
    this.load.image("soil_1", "/assets/soil_1.png");
    this.load.image("soil_2", "/assets/soil_2.png");
    this.load.image("soil_3", "/assets/soil_3.png");
    this.load.image("soil_4", "/assets/soil_4.png")
    this.load.image("soil_5", "/assets/soil_5.png")
    this.load.image("tree_01", "/assets/pine_01.png");
    this.load.image("tree_02", "/assets/pine_02.png");
    this.load.image("snowmon_1","/assets/snowman_1.png");
    this.load.image("snowmon_2","/assets/snowman_2.png");
    this.load.image("hole","/assets/hole.png");
    this.load.image("home", "/assets/home.png");
    this.load.image("snowball","/assets/snowball.png");
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

    this.load.spritesheet("snowman_run", "/assets/yeti_run.png", {
      frameWidth: 316,
      frameHeight: 260,
    });

    this.load.spritesheet("snowman_attack", "/assets/yeti_attack.png", {
      frameWidth: 283,
      frameHeight: 260,
    });

    // Sprite chạy (run)
    this.load.spritesheet("run", "/assets/run.png", {
      frameWidth: 261,
      frameHeight: 354,
    });

    this.load.spritesheet("die", "/assets/die.png", {
      frameWidth: 172,
      frameHeight:163,
    });
  }

  create() {
    this.scene.start("GameScene");
  }
}
