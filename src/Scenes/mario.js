import 'phaser';

export class Mario extends Phaser.Scene {
  constructor() {
    super('HRA');
    this.playerspeed = 200;
  }
  init() {}

  preload() {
    this.load.image('teren', '52571.png');
    this.load.tilemapTiledJSON('mapa', 'map.json');

    this.load.spritesheet('hrac', 'adventurer.png', { frameWidth: 50, frameHeight: 37 });
    this.load.audio('jump', 'jump.mp3');
    this.load.audio('walk', 'walk.mp3');
    this.load.audio('bg', 'mario.mp3');
    this.load.atlas('snek', 'snek2.png', 'snek2.json');

    // this.load.atlas('mario');
  }

  create() {
    //one way collision
    //phaser.io/examples/v2/arcade-physics/one-way-collision#gv
    https: this.cameras.main.setZoom(1.5);
    this.cameras.main.shake(1000, 0.02);
    let myMap = this.add.tilemap('mapa');
    let teren = myMap.addTilesetImage('52571', 'teren');
    myMap = myMap.createStaticLayer('Tile Layer 1', [teren], 0, 0);
    myMap.setCollisionByProperty({ collide: true });
    myMap.setTileIndexCallback([265, 266], function(sprite, tile) {
      if (sprite.texture.key === 'hrac') console.log('A ted jsem te sezral', sprite, tile);
    });
    myMap// myMap.setCollision // array of ids to collide

    .this.anims
      .create({
        key: 'jumpSnek',
        frames: this.anims.generateFrameNames('snek', {
          prefix: 'snek/jump/',
          suffix: '.png',
          start: 0,
          end: 4,
          zeroPad: 0,
        }),
        frameRate: 15,
        yoyo: true,
        repeat: -1,
      });

    this.snek = this.add.sprite(420, 420, 'snek').setScale(0.45);

    this.snek = this.physics.add.existing(this.snek, false);
    this.snek.body.setSize();
    this.snek.play('jumpSnek');
    this.snek.body.setBounceX(1);
    this.snek.body.setVelocityX(50);
    this.snek.body.setCollideWorldBounds(true, 0, 0.2);
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
    this.mario = this.add.sprite(100, 100, 'hrac').setScale(1);
    this.pl = this.add
      .sprite(250, 100, 'hrac')
      .setScale(1)
      .setTint(0xff55ff);
    this.physics.add.existing(this.pl, false);

    this.pl.body.setSize().setCollideWorldBounds(true);

    this.mario.play('stand');

    this.physics.add.existing(this.mario, false);

    console.log(this.physics);
    this.physics.add.collider(this.mario, this.pl);
    this.mario.body.setSize(21, 32).setCollideWorldBounds(true);

    // this.mario.body.setSize(5);
    // this.mario.an
    this.miUP = this.input.keyboard.addKey('w');
    this.miRIGHT = this.input.keyboard.addKey('d');
    this.miDOWN = this.input.keyboard.addKey('s');
    this.miLEFT = this.input.keyboard.addKey('a');
    let bg = this.sound.add('bg', {
      mute: false,
      volume: 0.7,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: -1,
      delay: 1,
    });
    bg.play();
    this.events.on('shutdown', function() {
      console.log('destroyed');
      bg.stop();
    });

    this.physics.add.collider(myMap, this.pl);
    this.physics.add.collider(myMap, this.snek);
    this.physics.add.collider(myMap, this.mario);
    this.physics.add.overlap(this.snek, this.mario, e => {
      this.scene.restart();
    });
    // velikost sveta
    this.physics.world.setBounds(0, 0, myMap.widthInPixels, myMap.heightInPixels);
    //po kliknuti mysi
    this.input.on('pointerdown', pointer => {
      let tile = myMap.getTileAtWorldXY(pointer.worldX, pointer.worldY);
      if (tile) {
        this.add
          .sprite(pointer.worldX, pointer.worldY - 30, 'snek')
          .setScale(0.5)
          .anims.play('jumpSnek');
        console.log(tile);
      }
    });

    // Posun kamery za hracem
    this.cameras.main.startFollow(this.mario, true, 0.15, 0.2);
    myMap.renderDebug(this.add.graphics(), {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(100, 255, 100, 50),
      faceColor: new Phaser.Display.Color(0, 200, 0),
    });
  }
  update() {
    this.mario.body.setVelocityX(0);
    if (this.snek.body.velocity.x < 0) {
      this.snek.setFlipX(true);
    } else {
      this.snek.setFlipX(false);
    }
    // console.log();
    if (this.miUP.isDown && this.mario.body.onFloor()) {
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
      this.mario.anims.playReverse('run', true);
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
