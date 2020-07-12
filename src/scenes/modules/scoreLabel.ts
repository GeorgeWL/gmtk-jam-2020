import 'phaser';
const formatScore = (score: number) => `Score: ${score}`

export default class ScoreLabel extends Phaser.GameObjects.Text {
  private score: number = 0;
  constructor(scene: Phaser.Scene, x: number, y: number, score: number, style: Phaser.Types.GameObjects.Text.TextStyle) {
    super(scene, x, y, formatScore(score), style)

    this.score = score
  }

  setScore(score: number) {
    this.score = score
    this.updateScoreText()
  }

  add(points: number) {
    this.setScore(this.score + points)
  }

  updateScoreText() {
    this.setText(formatScore(this.score))
  }

  resetScore() {
    this.setScore(0)
  }
}
