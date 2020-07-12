const GROUND_REF = 'ground'
const PLAYER_REF = 'player'
const STAR_REF = 'star'
const BOMB_REF = 'bomb'
const THEME_REF = 'theme'
import starSprite from '../assets/sprites/star.png'
import platformSprite from '../assets/sprites/platform.png'
import bombSprite from '../assets/sprites/bomb.png'
import playerSpriteSheet from '../assets/sprites/run-sprites.png'
import themeMusicMp3 from '../assets/audio/theme.mp3'
import themeMusicOgg from '../assets/audio/theme.ogg'
import ScoreLabel from './modules/scoreLabel'
import BombSpawner from './modules/bombSpawner'
import { config } from '../index';
export default class GameScene extends Phaser.Scene {
  private player: any
  private platforms: any
  private stars: any
  private keybinds: any
  private scoreLabel: ScoreLabel
  private bombSpawner: BombSpawner
  private gameLives: number = 5
  private isGameOver: boolean = false
  private music: Phaser.Sound.BaseSound

  constructor() {
    super('game-scene')
  }

  preload() {
    this.load.image(GROUND_REF, platformSprite)
    this.load.image(STAR_REF, starSprite)
    this.load.image(BOMB_REF, bombSprite)
    this.load.audio(THEME_REF, [
      themeMusicOgg,
      themeMusicMp3
    ]);
    this.load.spritesheet(PLAYER_REF,
      playerSpriteSheet,
      { frameWidth: 16, frameHeight: 16 }
    )
  }

  create() {
    this.platforms = this.createPlatforms()
    this.player = this.createPlayer()
    this.physics.add.collider(this.player, this.platforms)
    this.stars = this.createStars()
    this.scoreLabel = this.createScoreLabel(16, 16, 0).setScrollFactor(0)
    this.bombSpawner = new BombSpawner(this, BOMB_REF)
    this.player.setCollideWorldBounds(true)
    this.music = this.sound.add(THEME_REF)
    setTimeout(() => {
      this.music.play()
    }, 2000);
    const bombsGroup = this.bombSpawner.group

    this.physics.add.collider(this.stars, this.platforms)
    this.physics.add.collider(bombsGroup, this.platforms)
    this.physics.add.collider(this.player, bombsGroup, this.hitBomb, undefined, this)

    this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this)
    this.cameras.main.setBounds(0, 0, config.width * 10, config.height)
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setFollowOffset(-160, 0)
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
      key: 'death',
      frames: [{ key: PLAYER_REF, frame: 12 }],
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

  collectStar(player: any, star: any) {
    star.disableBody(true, true)
    this?.scoreLabel?.add(10)
    if (this.stars.countActive(true) === 0) {
      //  A new batch of stars to collect
      this.stars.children.iterate((child: { enableBody: (arg0: boolean, arg1: any, arg2: number, arg3: boolean, arg4: boolean) => void; x: any }) => {
        child.enableBody(true, child.x, 0, true, true)
      })
    }

    this.bombSpawner.spawn(player.x)
  }

  createScoreLabel(x: number, y: number, score: number) {
    const style = { fontSize: '32px', fill: '#000', fontFamily: '"Press Start 2P", monospace, cursive' }
    const label = new ScoreLabel(this, x, y, score, style)

    this.add.existing(label)

    return label
  }

  hitBomb(player: { setTint: (arg0: number | undefined) => void }, _bomb: any) {
    this.physics.pause()
    player.setTint(0xff0000)
    this.gameLives -= 1
    setTimeout(() => {
      player.setTint()
      this.physics.resume()
    }, 250);
    if (this.gameLives === 0) {
      this.isGameOver = true
    }
  }
  restart(scene: Phaser.Scenes.ScenePlugin, music: Phaser.Sound.BaseSound) {
    this.gameLives = 5
    this.isGameOver = false;
    music.stop()
    scene.restart();
  }

  update() {
    if (!this.isGameOver) {

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
    else {
      this.restart(this.scene, this.music)
    }
  }
}
