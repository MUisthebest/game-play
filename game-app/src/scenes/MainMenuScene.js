import Phaser from "phaser";

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  preload() {
    this.load.image("santa", "assets/santa.png");
  }

  create() {
    const { width, height } = this.scale;

    // Nền trắng tuyết
    this.add.rectangle(width / 2, height / 2, width, height, 0x0ffffff);

    // Hiệu ứng tuyết rơi (sửa cho phiên bản mới)
    this.createSnowEffect(width, height);

    // Santa ở giữa, hiệu ứng nhún nhẹ
    const santa = this.add.image(width / 2, height / 2 - 50, "santa")
      .setScale(0.5)
      .setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: santa,
      y: santa.y - 20,
      yoyo: true,
      repeat: -1,
      duration: 1500,
      ease: "Sine.easeInOut"
    });

    // Tiêu đề (trên Santa)
    const title = this.add.text(width / 2 , height / 2 - 220, "❄ SNOW DEFENSE ❄", {
      fontSize: "64px",
      color: "#00ffff",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: title,
      scale: { from: 0.9, to: 1.1 },
      yoyo: true,
      repeat: -1,
      duration: 1000,
      ease: "Sine.easeInOut"
    });

    // Nút Bắt đầu
    const startBtn = this.add.text(width / 2, height / 2 + 100, "▶ Bắt đầu", {
      fontSize: "36px",
      backgroundColor: "#222",
      color: "#fff",
      padding: { x: 30, y: 15 },
    }).setOrigin(0.5).setInteractive();

    // Nút Thoát
    const exitBtn = this.add.text(width / 2, height / 2 + 170, "🚪 Thoát", {
      fontSize: "32px",
      backgroundColor: "#222",
      color: "#fff",
      padding: { x: 30, y: 15 },
    }).setOrigin(0.5).setInteractive();

    // Hiệu ứng hover cho nút
    const onHover = (btn) => btn.setStyle({ backgroundColor: "#555" });
    const onOut = (btn) => btn.setStyle({ backgroundColor: "#222" });

    [startBtn, exitBtn].forEach(btn => {
      btn.on("pointerover", () => onHover(btn));
      btn.on("pointerout", () => onOut(btn));
    });

    // Sự kiện click
    startBtn.on("pointerdown", () => {
      this.scene.stop("MainMenuScene");
      this.scene.start("GameScene");
    });

    exitBtn.on("pointerdown", () => {
      this.game.destroy(true);
    });

    // Footer
    this.add.text(width / 2, height - 50, "© 2025 - Made by Tui 💙", {
      fontSize: "18px",
      color: "#000",
    }).setOrigin(0.5);
  }

  // Hiệu ứng tuyết rơi (sửa cho Phaser mới - không dùng createEmitter)
  createSnowEffect(width, height) {
    // Tạo texture tuyết nhỏ (hình tròn trắng)
    if (!this.textures.exists("snowflake")) {
      const gfx = this.make.graphics({ x: 0, y: 0 }, false);
      gfx.fillStyle(0xffffff);
      gfx.fillCircle(3, 3, 3);
      gfx.generateTexture("snowflake", 6, 6);
      gfx.destroy();
    }

    // Tạo emitter TRỰC TIẾP qua config (thay vì particles.createEmitter)
    const emitter = this.add.particles(0, 0, "snowflake", {
      // Vị trí emit (từ trên màn hình, ngẫu nhiên theo width)
      x: { min: 0, max: width },
      y: { min: -50, max: 0 },

      // Tốc độ rơi (chậm, ngẫu nhiên)
      speedX: { min: -10, max: 10 },  // Lắc nhẹ ngang
      speedY: { min: 20, max: 50 },

      // Góc bay (hơi lệch)
      angle: { min: -20, max: 20 },

      // Kích thước (nhỏ dần khi rơi)
      scale: { start: 0.3, end: 0.1 },

      // Thời gian sống (4 giây)
      lifespan: 4000,

      // Số lượng: emit 2 particle mỗi 100ms (liên tục)
      quantity: 2,
      frequency: 100,

      // Lực hút xuống (tuyết rơi)
      gravityY: 30,

      // Hiệu ứng ánh sáng nhẹ
      blendMode: "ADD",

      // Độ trong suốt (fade out khi rơi)
      alpha: { start: 0.8, end: 0.2 },

      // Emit liên tục
      emitZone: { type: "random", width: width, height: 50 }
    });

    // Đặt vị trí emitter ở giữa (nó sẽ emit từ x/y config)
    emitter.setPosition(width / 2, 0);

    // Tùy chọn: Dừng emitter sau 10 giây (nếu muốn)
    // this.time.delayedCall(10000, () => emitter.stop());
  }
}