import Phaser from 'phaser';
import Boot from './assets/scenes/Boot';

//-----------------------------------------------------------------------------------------------------------
/**
 * Game config (properties are defined by Phaser)
 */
/** @type Phaser.Types.Core.GameConfig */const pConfig = {
    title       : 'Skyblaze Slash (Phaser 3)',
    version     : '1.0.0',

    width       : 640,
    height      : 1136,
    type        : Phaser.AUTO,
    scale       : {
        autoCenter : Phaser.Scale.Center.CENTER_BOTH,
        mode       : Phaser.Scale.FIT
    },
    input       : {
        activePointers: 1,
        keyboard: false
    },
    render: {
        antialias: true
    },
    parent      : 'phaser-example',
    disableContextMenu: true,

    scene       : Boot
};

//-----------------------------------------------------------------------------------------------------------
/**
 * Entry point: Game starts here
 */
window.onload = function() {
    window.game = new Phaser.Game( pConfig );
};

// COMPLETELY DISABLE LOG
//console.log = console.warn = console.error = function () {};