import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const { width, height } = this.scale;

    // Làm mờ nền
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);

    // Hiệu ứng "GAME OVER"
    const gameOverText = this.add.text(width / 2, height / 2 - 100, "GAME OVER", {
      fontSize: "64px",
      color: "#ff4444",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: gameOverText,
      scale: { from: 0.8, to: 1.1 },
      yoyo: true,
      repeat: -1,
      duration: 800,
    });

    // Hiển thị điểm (nếu có)
    this.add.text(width / 2, height / 2 - 20, `Score: ${this.finalScore}`, {
      fontSize: "32px",
      color: "#ffffff",
    }).setOrigin(0.5);

    // Nút "Chơi lại"
    const restartBtn = this.add.text(width / 2, height / 2 + 50, "🔁 Chơi lại", {
      fontSize: "28px",
      backgroundColor: "#222",
      color: "#fff",
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive();

    // Nút "Thoát"
    const exitBtn = this.add.text(width / 2, height / 2 + 120, "🚪 Thoát", {
      fontSize: "28px",
      backgroundColor: "#222",
      color: "#fff",
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive();

    // Hover effect
    const onHover = (btn) => btn.setStyle({ backgroundColor: "#555" });
    const onOut = (btn) => btn.setStyle({ backgroundColor: "#222" });

    restartBtn.on("pointerover", () => onHover(restartBtn));
    restartBtn.on("pointerout", () => onOut(restartBtn));
    exitBtn.on("pointerover", () => onHover(exitBtn));
    exitBtn.on("pointerout", () => onOut(exitBtn));

    // Click hành động
    restartBtn.on("pointerdown", () => {
      this.scene.stop("GameOverScene");
      this.scene.stop("GameScene");
      this.scene.start("GameScene"); // restart lại màn
    });

    exitBtn.on("pointerdown", () => {
      this.scene.stop("GameOverScene");
      this.scene.start("MainMenuScene"); // quay lại menu chính (nếu có)
    });
  }
}
