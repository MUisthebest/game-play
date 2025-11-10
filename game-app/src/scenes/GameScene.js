import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.treeColliders = null;
    this.trees = null;
    this.snowmen = null;
    this.home = null;
    this.playerHpBar = null;
    this.playerMaxHp = 100;
    this.playerHp = 100;
    this.soilGroup = null;
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tiles", "tiles");

    const groundLayer = map.createLayer("layer1", tileset, 0, 0);
    groundLayer.setCollisionByExclusion([-1]);

    const tileSize = map.tileWidth;
    const layerData = map.layers[0];
    for (let y = 0; y < layerData.height; y++) {
      for (let x = 0; x < layerData.width; x++) {
        const tile = map.getTileAt(x, y, false, "layer1");
        if (!tile || tile.index === 0) {
          this.add.image(
            x * tileSize + tileSize / 2,
            y * tileSize + tileSize / 2,
            "snow"
          )
          .setDisplaySize(tileSize, tileSize)
          .setDepth(-1);
        }
      }
    }

    this.treeColliders = this.physics.add.staticGroup();
    this.trees = this.add.group();
    this.snowmen = this.physics.add.group();
    this.soilGroup = this.physics.add.group();

    const treeObjects = map.getObjectLayer("Trees")?.objects || [];
    const snowmanObjects = map.getObjectLayer("Snowmen")?.objects || [];
    const homeObjects = map.getObjectLayer("Home")?.objects || [];
    const soilObjects = map.getObjectLayer("Soil")?.objects || [];
    const snowmonObjects = map.getObjectLayer("Snowmon")?.objects || [];

    treeObjects.forEach(obj => {
      const x = obj.x;
      const y = obj.y;
      const type = obj.type;
      const sprite = this.add.sprite(x, y + tileSize, type)
        .setOrigin(0.5, 1)
        .setScale(2)
        .setDepth(10);
      this.trees.add(sprite);
      const collider = this.physics.add.staticImage(x, y, "snow")
        .setSize(32, 60)
        .setVisible(false);
      this.treeColliders.add(collider);
    });

    snowmonObjects.forEach(obj => {
      const x = obj.x;
      const y = obj.y;
      const type = obj.type;
      const sprite = this.add.sprite(x, y + tileSize, type)
        .setOrigin(0.5, 1)
        .setScale(1)
        .setDepth(9);
      this.trees.add(sprite);
      const collider = this.physics.add.staticImage(x, y, "snow")
        .setSize(20, 20)
        .setOffset(10,20)
        .setVisible(false);
      this.treeColliders.add(collider);
    });

    soilObjects.forEach(obj => {
      const x = obj.x;
      const y = obj.y;

      // Thêm hình ảnh soil_1 tại vị trí object
      const soil = this.add.image(x, y, obj.type)
        .setOrigin(0.5, 1)
        .setScale(1)
        .setDepth(-0.5)
        .setRotation(obj.rotation); // nằm dưới các vật thể khác
      this.soilGroup.add(soil);
    });
    snowmanObjects.forEach(obj => {
      if (obj.type === "snowman") {
        const x = obj.x;
        const y = obj.y;
        const snowman = this.physics.add.sprite(x, y, "snowman")
          .setScale(0.4)
          .setBounce(0.1)
          .setCollideWorldBounds(true)
          .setSize(120,120)
          .setOffset(80, 0)
          .setDepth(10);

        snowman.hp = 50;
        snowman.maxHp = 50;
        snowman.speed = 50;


        this.snowmen.add(snowman);
      }
    });

    homeObjects.forEach(obj => {
      if (obj.type === "home") {
        const x = obj.x;
        const y = obj.y;
        const home = this.add.sprite(x, y, "home")
          .setOrigin(0.5, 1)
          .setScale(1)
          .setDepth(10);
        const conlider = this.physics.add.staticImage(x , y - obj.height / 2, "home")
          .setSize(obj.width/2, obj.height/2 + 20)
          .setVisible(false);
        this.treeColliders.add(conlider);
        this.home = home;
      }
    });

    // === PLAYER ===
    this.player = this.physics.add.sprite(100, 150, "idle")
      .setScale(0.2)
      .setCollideWorldBounds(true)
      .setOrigin(0.5, 1)
      .setBounce(0.1);
    this.player.play("idle");
    this.player.hp = 100;
    this.player.maxHp = 100;

    // Thanh máu player
    this.playerHpBar = this.add.graphics();

    this.physics.world.gravity.y = 0;

    // === COLLISIONS ===
    this.physics.add.collider(this.player, groundLayer);
    this.physics.add.collider(this.player, this.treeColliders);
    this.physics.add.collider(this.snowmen, groundLayer);
    this.physics.add.collider(this.snowmen, this.treeColliders);
    this.physics.add.collider(this.player, this.home);


    // === Gây sát thương khi chạm ===
    this.physics.add.overlap(this.player, this.snowmen, this.onPlayerHit, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("idle", { start: 0, end: 5 }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("run", { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "die",
      frames: this.anims.generateFrameNumbers("die", { start: 0, end: 4 }),
      frameRate: 5,
       repeat: 0,
    });

    this.anims.create({
      key: "snowman_idle",
      frames: this.anims.generateFrameNumbers("snowman", { start: 0, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "snowman_run",
      frames: this.anims.generateFrameNumbers("snowman_run", { start: 0, end: 5 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "snowman_attack",
      frames: this.anims.generateFrameNumbers("snowman_attack", { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  // === PLAYER BỊ TẤN CÔNG ===
  onPlayerHit(player, snowman) {
    if (this.player.hp === 0) return;
    if (!snowman.lastAttack || this.time.now - snowman.lastAttack > 1000) {
      snowman.lastAttack = this.time.now;
      snowman.anims.play("snowman_attack", true);
      this.player.hp -= 10;
      if (this.player.hp < 0) this.player.hp = 0;
    }
  }

  // === CẬP NHẬT THANH MÁU ===
  updateHpBar(entity) {
    if (!entity.hpBar) return;
    const barWidth = 40;
    const barHeight = 5;
    const hpPercent = entity.hp / entity.maxHp;
    const x = entity.x - barWidth / 2;
    const y = entity.y - entity.displayHeight - 10;

    entity.hpBar.clear();
    entity.hpBar.fillStyle(0x000000);
    entity.hpBar.fillRect(x - 1, y - 1, barWidth + 2, barHeight + 2);
    entity.hpBar.fillStyle(0xff0000);
    entity.hpBar.fillRect(x, y, barWidth * hpPercent, barHeight);
  }

  shootSnowball(snowman, target) {
  if (!this.snowballs) {
    this.snowballs = this.physics.add.group();
  }

  const snowball = this.physics.add.image(snowman.x, snowman.y - 40, "snowball")
    .setScale(0.1)
    .setCircle(30)
    .setCollideWorldBounds(false);

  // Tính vận tốc hướng đến player
  const dx = target.x - snowman.x;
  const dy = target.y - snowman.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const speed = 300;

  snowball.setVelocity((dx / dist) * speed, (dy / dist) * speed);

  // Xoá đạn sau 3s
  this.time.delayedCall(3000, () => {
    if (snowball.active) snowball.destroy();
  });

  // Khi đạn chạm player
  this.physics.add.overlap(this.player, snowball, () => {
    if (snowball.active) {
      this.player.hp -= 10;
      if (this.player.hp <= 0) {
        this.player.hp = 0;
      }
      snowball.destroy();
    }
  });
}


  update() {
    if (this.player.hp === 0) {
      if (!this.player.isDead) {
        this.player.isDead = true;
        this.player.setVelocity(0);
        this.player.body.enable = false;
        this.player.setScale(0.5);
        this.player.play("die", true);
        // Chờ animation die hoàn thành
        this.player.once("animationcomplete-die", () => {
            if (this.playerHpBar) {
            this.playerHpBar.destroy();
            this.playerHpBar = null;
          }
          this.player.destroy();
          this.scene.launch("GameOverScene");
          this.scene.pause();
        });
      }
      this.updateHpBar({
        x: this.player.x,
        y: this.player.y,
        displayHeight: this.player.displayHeight,
        hp: this.player.hp,
        maxHp: this.player.maxHp,
        hpBar: this.playerHpBar
      });
      return;
    }

      if (this.home) {
        const doorX = 575;
        const doorY = 550;

        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, doorX, doorY);

        if (dist < 25) { // ngưỡng va chạm cửa
          this.scene.launch("VictoryScene");
          this.scene.pause();
        }
      }
    const speed = 150;
    this.player.setVelocity(0);

    // Player di chuyển
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

    if (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0)
      this.player.anims.play("run", true);
    else this.player.anims.play("idle", true);

    // Cập nhật thanh máu player
    this.updateHpBar({
      x: this.player.x,
      y: this.player.y,
      displayHeight: this.player.displayHeight,
      hp: this.player.hp,
      maxHp: this.player.maxHp,
      hpBar: this.playerHpBar
    });

    // === SNOWMEN ===
 this.snowmen.children.iterate((snowman) => {
  if (!snowman.active) return;

  const dx = this.player.x - snowman.x;
  const dy = this.player.y - snowman.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  const detectRange = 300;
  const attackCooldown = 1500; // ms

  if (!snowman.state) snowman.state = "idle";

  switch (snowman.state) {
    case "idle":
      snowman.setVelocity(0);
      snowman.anims.play("snowman_idle", true);

      if (dist < detectRange) {
        snowman.state = "attack";
      }
      break;

    case "attack":
      snowman.setVelocity(0);
      snowman.flipX = dx < 0;

      if (!snowman.lastAttack || this.time.now - snowman.lastAttack > attackCooldown) {
        snowman.lastAttack = this.time.now;
        snowman.anims.play("snowman_attack", true);

        // Bắn đạn tuyết
        this.shootSnowball(snowman, this.player);
      }

      // Nếu player ra quá xa thì quay lại idle
      if (dist > detectRange + 50) {
        snowman.state = "idle";
      }
      break;
      default:
        break;
  }

  this.updateHpBar(snowman);
});
  }
}
