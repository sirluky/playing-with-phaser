import 'phaser';
import { Mario } from './mario';

class Menu extends Phaser.Scene {
  constructor() {
    super('MENU');
  }
  // init() {
  //   console.log('SimpleScene#init');
  // }

  preload() {
    this.load.image('play', 'play.png');
    this.load.spritesheet('hrac', 'adventurer.png', { frameWidth: 50, frameHeight: 37 });

    // this.load.atlas('mario');
    // this.scene.start('')
  }

  create() {
    var config = {
      key: 'stand',
      frames: this.anims.generateFrameNumbers('hrac', {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      yoyo: true,
      repeat: -1,
    };
    this.anims.create(config);
    // this.add.sprite('')
    let hrac = this.add.sprite(0, 0, 'hrac').setVisible(false);

    let play = this.add
      .image(320, 100, 'play')
      .setScale(1.5)
      .setOrigin(0.5, 0.5);

    play.setInteractive();
    play.on('pointerdown', e => {
      this.scene.start('HRA');
    });
    play.on('pointerover', e => {
      // hrac.setActive(true);
      hrac.setVisible(true);
    });
    play.on('pointerout', e => {
      // hrac.setActive(false);
      hrac.setVisible(false);
    });
    hrac.setPosition(play.x - 130, play.y);

    hrac.setScale(1.6).play('stand');
  }
}
export { Menu };
