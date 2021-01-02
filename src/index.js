import Phaser from 'phaser';
import Boot from './assets/scenes/Boot';

// add global variable for using in console: game.state.getCurrentState()
/** @type Phaser.Game */var game;

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
    let game = new Phaser.Game( pConfig );

    // user-defined data
    game.data = {
        bgm         : '',
        userLevel   : 1
    };

    window.game = game;
};

// COMPLETELY DISABLE LOG
//console.log = console.warn = console.error = function () {};