import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tiles", "tiles");
    this.physics.world.gravity.y = 100;
    const ground = map.createLayer("layer1", tileset, 0, 0);
    const graphics = this.add.graphics();
    const tileSize = map.tileWidth;

    const treeTiles = [];
    ground.forEachTile((tile) => {
      if (tile.index === 2) {
        // Lưu lại vị trí tile cây
        treeTiles.push(tile);

        // Ẩn tile khỏi render (để không vẽ “tường” hình vuông)
        tile.visible = false;

        // ⚡ Tạo collider tĩnh thay thế cho tile bị ẩn
        const collider = this.physics.add.staticImage(
          tile.getCenterX(),
          tile.getCenterY(),
          "snow"
        );
        collider.setSize(tileSize, tileSize);
        collider.setVisible(false);

        // Cho vào nhóm tĩnh để va chạm
        if (!this.treeColliders) this.treeColliders = this.physics.add.staticGroup();
        this.treeColliders.add(collider);
      }
      if (tile.index === 3) {
          const collider = this.physics.add.staticImage(
          tile.getCenterX(),
          tile.getCenterY(),
          "snow"
        );
        collider.setSize(tileSize, tileSize);
        collider.setVisible(false);
      }
    });
    // Tạo group tĩnh cho cây
    this.trees = this.physics.add.staticGroup();
    this.snowmen = this.physics.add.staticGroup();
    for (const tile of treeTiles) {
      const x = tile.getCenterX();
      const y = tile.getCenterY();

      // 🪵 Tạo sprite cây
      const tree = this.add.sprite(x, y + tileSize -1, "tree"); // dịch lên để gốc cây ở đúng vị trí tile
      tree.setOrigin(0.5, 1);
      tree.setDepth(10);

      // ⚡ Tạo collider ảo ở gốc cây (1 tile)
      const collider = this.physics.add.staticImage(x, y, "snow");
      collider.setSize(32, 32); // 1 tile vuông
      collider.setVisible(false); // ẩn collider
      this.trees.add(collider);
    }

      const layerData = map.layers[0];
      for (let y = 0; y < layerData.height; y++) {
        for (let x = 0; x < layerData.width; x++) {
          const tile = map.getTileAt(x, y, false, "layer1");

          // ❄️ Chỉ thêm tuyết nếu tile trống (index = 0)
          // 🚫 Bỏ qua tile là cây (index = 2)
          if (!tile || tile.index === 0 || tile.index === 2) {
            this.add.image(
              x * tileSize + tileSize / 2,
              y * tileSize + tileSize / 2,
              "snow"
            )
            .setDisplaySize(tileSize, tileSize)
            .setDepth(-1);
          }

          else if (tile.index === 2) continue;
          else if (tile.index === 3) {
            const snowman = this.physics.add.sprite(
              x * tileSize + tileSize / 2,
              y * tileSize - tileSize / 2,
              "snowman"
            );
            snowman.setBounce(0.1);
            snowman.setScale(0.5);
            snowman.setCollideWorldBounds(true);
            this.snowmen.add(snowman);
            this.physics.add.collider(snowman, ground);
          }
        }
      }



    graphics.setDepth(-1);
    ground.setCollisionByExclusion([-1]);

    // 🎅 Khởi tạo nhân vật với sprite "idle"
    this.player = this.physics.add.sprite(100, 150, "idle");
    this.player.setBounce(0.1);
    this.player.setScale(0.25);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, ground);

    // Đặt lớp nền dưới layer tilemap
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

    this.anims.create({
      key: "snowman_idle",
      frames: this.anims.generateFrameNumbers("snowman", { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1,
    });
    this.snowmen.children.iterate((snowman) => {
      snowman.play("snowman_idle");
    });
    this.player.setOrigin(0.5, 1);
    this.player.play("idle");
  }

  update() {
    const speed = 150;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.flipX = false;
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
    }

    // Animation
    if (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0) {
      this.player.anims.play("run", true);
    } else {
      this.player.anims.play("idle", true);
    }
  }
}
