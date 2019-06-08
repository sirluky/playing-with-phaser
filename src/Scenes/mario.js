import 'phaser';

export class Mario extends Phaser.Scene {
  constructor() {
    super('HRA');
    this.playerspeed = 200;
  }
  // init() {
  //   console.log('SimpleScene#init');
  // }

  preload() {
    console.log('SimpleScene#preload');
    this.load.spritesheet('hrac', 'adventurer.png', { frameWidth: 50, frameHeight: 37 });
    this.load.audio('jump', 'jump.mp3');
    this.load.audio('walk', 'walk.mp3');
    this.load.audio('bg', 'mario.mp3');

    // this.load.atlas('mario');
  }

  create() {
    this.sound.add('jump', {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    });

    this.walk = this.sound.add('walk', {
      mute: false,
      volume: 1,
      rate: 5,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
      start: 3,
      end: 5,
    });
    this.sound.play('bg', { volume: 0.7, loop: -1, delay: 1 });

    var config = {
      key: 'stand',
      frames: this.anims.generateFrameNumbers('hrac', {
        start: 0,
        end: 3,
        first: 1,
      }),
      frameRate: 15,
      yoyo: true,
      repeat: -1,
    };
    this.anims.create(config);
    var config = {
      key: 'run',
      frames: this.anims.generateFrameNumbers('hrac', {
        start: 8,
        end: 13,
      }),
      frameRate: 10,
      yoyo: true,
      repeat: 0,
    };
    this.anims.create(config);
    console.log('SimpleScene#create');
    this.mario = this.add.sprite(100, 100, 'hrac').setScale(2);
    this.pl = this.add
      .sprite(250, 100, 'hrac')
      .setScale(2)
      .setTint(0xff55ff);
    this.physics.add.existing(this.pl, false);

    this.pl.body.setSize().setCollideWorldBounds(true);

    this.mario.play('stand');

    this.physics.add.existing(this.mario, false);

    console.log(this.physics);
    this.physics.add.collider(this.mario, this.pl);
    this.mario.body.setSize().setCollideWorldBounds(true);

    // this.mario.body.setSize(5);
    // this.mario.an
    this.miUP = this.input.keyboard.addKey('w');
    this.miRIGHT = this.input.keyboard.addKey('d');
    this.miDOWN = this.input.keyboard.addKey('s');
    this.miLEFT = this.input.keyboard.addKey('a');
  }
  update() {
    this.mario.body.setVelocityX(0);
    // console.log();
    if (
      this.miUP.isDown &&
      this.mario.body.checkWorldBounds() &&
      !this.mario.body.onWall() &&
      !this.mario.body.onCeiling()
    ) {
      console.log();
      this.mario.body.setVelocityY(-this.playerspeed * 3);
      this.sound.play('jump');
      this.walk.stop();
    }
    if (this.miRIGHT.isDown) {
      this.mario.body.setVelocityX(this.playerspeed);
      this.mario.setFlipX(false);
      this.mario.play('run', true);
    }
    if (this.miLEFT.isDown) {
      this.mario.body.setVelocityX(-this.playerspeed);
      this.mario.setFlipX(true);
      this.mario.play('run', true);
    }
    if (Math.abs(this.mario.body.velocity.x) < 10) {
      this.mario.body.velocity.x = 0;
      this.mario.play('stand', true);
      this.walk.stop();
    } else {
      if (this.mario.body.checkWorldBounds()) {
        if (!this.walk.isPlaying) this.walk.play();
      }
    }
  }
}
