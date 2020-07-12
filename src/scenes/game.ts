const GROUND_REF = 'ground'
const PLAYER_REF = 'player'
const STAR_REF = 'star'
const BOMB_REF = 'bomb'
import starSprite from '../assets/star.png'
import platformSprite from '../assets/platform.png'
import bombSprite from '../assets/bomb.png'
import playerSpriteSheet from '../assets/run-sprites.png'
import ScoreLabel from './modules/scoreLabel'
import BombSpawner from './modules/bombSpawner'

export default class GameScene extends Phaser.Scene {
  private player: Phaser.GameObjects.GameObject | Phaser.GameObjects.Group | Phaser.GameObjects.GameObject[] | Phaser.GameObjects.Group[]
  private platforms: Phaser.GameObjects.GameObject | Phaser.GameObjects.Group | Phaser.GameObjects.GameObject[] | Phaser.GameObjects.Group[]
  private stars: Phaser.GameObjects.GameObject | Phaser.GameObjects.Group | Phaser.GameObjects.GameObject[] | Phaser.GameObjects.Group[]
  private keybinds: any
  private scoreLabel: ScoreLabel
  private bombSpawner: BombSpawner
  private gameLives: number = 5
  private isGameOver: boolean = false
  constructor() {
    super('game-scene')
  }

  preload() {
    this.load.image(GROUND_REF, platformSprite)
    this.load.image(STAR_REF, starSprite)
    this.load.image(BOMB_REF, bombSprite)

    this.load.spritesheet('player',
      playerSpriteSheet,
      { frameWidth: 16, frameHeight: 16 }
    )
  }

  create() {
    this.platforms = this.createPlatforms()
    this.player = this.createPlayer()
    this.physics.add.collider(this.player, this.platforms)
    this.stars = this.createStars()
    this.scoreLabel = this.createScoreLabel(16, 16, 0)
    this.bombSpawner = new BombSpawner(this, BOMB_REF)
    const bombsGroup = this.bombSpawner.group

    this.physics.add.collider(this.stars, this.platforms)
    this.physics.add.collider(this.stars, this.platforms)
    this.physics.add.collider(bombsGroup, this.platforms)
    this.physics.add.collider(this.player, bombsGroup, this.hitBomb, null, this)

    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)

    this.keybinds = this.input.keyboard.createCursorKeys()
  }
  createPlatforms() {
    const platforms = this.physics.add.staticGroup()
    platforms.create(600, 400, GROUND_REF)
    platforms.create(50, 250, GROUND_REF)
    platforms.create(20, 550, GROUND_REF)
    platforms.create(750, 220, GROUND_REF)
    return platforms;
  }
  createPlayer() {
    const player = this.physics.add.sprite(100, 450, PLAYER_REF)
    player.setBounce(0.2)
    player.setCollideWorldBounds(true)

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(PLAYER_REF, { start: 5, end: 0 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'turn',
      frames: [{ key: PLAYER_REF, frame: 5 }],
      frameRate: 20
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(PLAYER_REF, { start: 6, end: 11 }),
      frameRate: 10,
      repeat: -1
    })
    return player
  }
  createStars() {
    const starConfig = {
      key: STAR_REF,
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    }
    const stars = this.physics.add.group(starConfig)

    stars.children.iterate((child) => {
      child?.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6))
    })

    return stars
  }
  collectStar(player: any, star: { disableBody: (arg1: any, arg2: any) => any }) {
    star.disableBody(true, true)
    this?.scoreLabel?.add(10)
    if (this.stars.countActive(true) === 0) {
      //  A new batch of stars to collect
      this.stars.children.iterate((child) => {
        child.enableBody(true, child.x, 0, true, true)
      })
    }

    this.bombSpawner.spawn(player.x)
  }
  createScoreLabel(x: number, y: number, score: number) {
    const style = { fontSize: '32px', fill: '#000' }
    const label = new ScoreLabel(this, x, y, score, style)

    this.add.existing(label)

    return label
  }
  hitBomb(player, bomb) {
    this.physics.pause()

    player.setTint(0xff0000)

    player.anims.play('turn')

    this.isGameOver = true
  }
  update() {
    if (this?.keybinds?.left?.isDown) {
      this?.player?.setVelocityX(-160)

      this?.player?.anims.play('left', true)
    }
    else if (this?.keybinds?.right?.isDown) {
      this?.player?.setVelocityX(160)

      this?.player?.anims.play('right', true)
    }
    else {
      this?.player?.setVelocityX(0)

      this?.player?.anims.play('turn')
    }

    if (this?.keybinds?.up?.isDown && this?.player?.body?.touching?.down) {
      this?.player?.setVelocityY(-330)
    }
  }
}
