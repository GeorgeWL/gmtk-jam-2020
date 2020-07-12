import 'phaser';
import HelloWorldScene from './scenes/helloWorldScene';

const gameContainer = document.getElementById('game-window')
const config = {
  type: Phaser.AUTO,
  backgroundColor: '#125555',
  width: 812,
  height: 375,
  parent: gameContainer,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: HelloWorldScene
};

const game = new Phaser.Game(config);
if (module.hot) {
  module.hot.accept()
}


// Display controls in top right Corner
// Highlight when a control is keydown
// when a control is keyup, change control keybind

// Display Life counter in top left corner - 5 hearts
// when die, lose heart, respawn at start of section
