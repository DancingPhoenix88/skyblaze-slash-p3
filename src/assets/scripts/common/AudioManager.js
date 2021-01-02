"use strict";

function AudioManager () {
    this.soundsMap = {};
    this.ENABLED = false;
}
//-----------------------------------------------------------------------------------------------------------
AudioManager.prototype = {
    /**
     * [AUDIO] Load & cache SFX
     * @param key : SFX key
     * @param volume (optional) : SFX volume
     */
    load : function (state, key, volume) {
        if (!this.ENABLED) return null;
        /** Number */var v = isNaN(volume) ? 1 : volume;
        /** Phaser.Sound */var s = state.add.sound( 'sfx-' + key, v );
        this.soundsMap[ key ] = s;
        return s; // could be append .play() immediately 
    },
    //-----------------------------------------------------------------------------------------------------------
    /**
     * [AUDIO] Load & cache BGM
     * @param key : BGM key
     * @param volume (optional) : BGM volume
     * @param loop (optional) : BGM volume
     */
    loadBgm : function (state, key, volume, loop) {
        if (!this.ENABLED) return null;
        /** Number */var v = isNaN(volume) ? 1 : volume;
        /** Phaser.Sound */var s = state.add.sound( key, v, loop );
        this.soundsMap[ key ] = s;
        game.input.addMoveCallback( this._autoResume );
        return s; // could be append .play() immediately 
    },
    //-----------------------------------------------------------------------------------------------------------
    /**
     * [AUDIO] Play SFX
     * @param key : SFX key
     */
    play : function (key) {
        if (!this.ENABLED) return;
        /** @type Phaser.Sound */var s = this.soundsMap[ key ];
        if (s != undefined) {
            s.play();
        } else {
//            console.error( 'sfx "' + key + '" not found' );
        }
    },
    //-----------------------------------------------------------------------------------------------------------
    /**
     * [AUDIO] Resume playing suspended audio (warning: AudioContext was not allowed to start...)
     */
    _autoResume : function () {
        if (game.sound.context.state == 'suspended') {
            game.sound.context.resume();
        }
    }
};
//-----------------------------------------------------------------------------------------------------------
/** @type AudioManager */AudioManager.Singleton = new AudioManager();