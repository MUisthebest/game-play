import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tiles", "tiles");
    const ground = map.createLayer("layer1", tileset, 0, 0);
        const graphics = this.add.graphics();
    const tileSize = map.tileWidth;


    const layerData = map.layers[0];
    for (let y = 0; y < layerData.height; y++) {
      for (let x = 0; x < layerData.width; x++) {
        const tile = map.getTileAt(x, y, false, "layer1");
        if (!tile || tile.index === 0) {
          graphics.fillStyle(0x88ccff, 1);
          graphics.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      }
    }

    // Đặt lớp nền dưới layer tilemap
    graphics.setDepth(-1);
    ground.setCollisionByExclusion([-1]);

    // 🎅 Khởi tạo nhân vật với sprite "idle"
    this.player = this.physics.add.sprite(100, 100, "idle");
    this.player.setBounce(0.1);
    this.player.setScale(0.3);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, ground);

    this.cursors = this.input.keyboard.createCursorKeys();

    // 💤 Animation idle (6 frame)
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("idle", { start: 0, end: 5 }),
      frameRate: 6,
      repeat: -1,
    });

    // 🏃 Animation run (12 frame)
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("run", { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1,
    });
    this.player.setOrigin(0.5, 1);
    this.player.play("idle");
  }

  update() {
    const speed = 160;
    const jump = -200;

    if (this.cursors.left.isDown) {
      this.player.flipX = true;
      this.player.setVelocityX(-speed);
      if (this.player.anims.currentAnim.key !== "run") {
        this.player.anims.play("run", true);
      }
    } else if (this.cursors.right.isDown) {
      this.player.flipX = false;
      this.player.setVelocityX(speed);
      if (this.player.anims.currentAnim.key !== "run") {
        this.player.anims.play("run", true);
      }
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("idle", true);
      this.player.setScale(0.3);
    }

    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(jump);
    }
  }
}
