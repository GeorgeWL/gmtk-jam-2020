import 'phaser';
import GameScene from './scenes/game';

const gameContainer = document.getElementById('game-window')
export const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 }
    }
  },
  parent: gameContainer,
  scene: [GameScene]
}

export default new Phaser.Game(config)
if (module.hot) {
  module.hot.accept()
}


// Display controls in top right Corner
// Highlight when a control is keydown
// when a control is keyup, change control keybind

// Display Life counter in top left corner - 5 hearts
// when die, lose heart, respawn at start of section
