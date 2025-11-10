import Phaser from "phaser";

export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super("VictoryScene");
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const { width, height } = this.scale;

    // Làm mờ nền
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);

    // Text "YOU WIN!"
    const winText = this.add.text(width / 2, height / 2 - 100, "🏆 YOU WIN!", {
      fontSize: "64px",
      color: "#00ff88",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Hiệu ứng rung nhẹ
    this.tweens.add({
      targets: winText,
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

    // Nút "Về menu chính"
    const menuBtn = this.add.text(width / 2, height / 2 + 120, "🏠 Menu chính", {
      fontSize: "28px",
      backgroundColor: "#222",
      color: "#fff",
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive();

    const onHover = (btn) => btn.setStyle({ backgroundColor: "#555" });
    const onOut = (btn) => btn.setStyle({ backgroundColor: "#222" });

    restartBtn.on("pointerover", () => onHover(restartBtn));
    restartBtn.on("pointerout", () => onOut(restartBtn));
    menuBtn.on("pointerover", () => onHover(menuBtn));
    menuBtn.on("pointerout", () => onOut(menuBtn));

    restartBtn.on("pointerdown", () => {
      this.scene.stop("VictoryScene");
      this.scene.stop("GameScene");
      this.scene.start("GameScene");
    });

    menuBtn.on("pointerdown", () => {
      this.scene.stop("VictoryScene");
      this.scene.start("MainMenuScene");
    });
  }
}
