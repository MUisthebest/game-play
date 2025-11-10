import React, { useEffect } from "react";
import Phaser from "phaser";
import PreloadScene from "../scenes/PreloadScene";
import GameScene from "../scenes/GameScene";
import GameOverScene from "../scenes/GameOverScene";

export default function Game() {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 500 },
          debug: false,
        },
      },
      scene: [PreloadScene, GameScene, GameOverScene],
    };

    const game = new Phaser.Game(config);
    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div
      id="game-container"
      style={{
        margin: "auto",
        border: "2px solid #333",
        borderRadius: "10px",
        background: "transparent",
      }}
    />
  );
}
