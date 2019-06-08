import Phaser from 'phaser';
import { Menu } from './Scenes/menu';
import { Mario } from './Scenes/mario';
window.onload = function() {
  var config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    backgroundColor: 0x5e91fe,
    scene: [Menu, Mario],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 800, x: 0 },
        debug: true,
      },
    },
  };

  var game = new Phaser.Game(config);
};
/**
 *
 */
