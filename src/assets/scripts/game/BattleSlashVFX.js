function BattleSlashVFX (vfxGroup) {
    this.add = game.state.getCurrentState().add;
    this._group = vfxGroup;
    this._pool = null;
    this._MAX_INSTANCES = 20;
    
    this.init();
}
//-----------------------------------------------------------------------------------------------------------
BattleSlashVFX.prototype = {
    init : function () {
        this._pool = new RecyclePool( this._MAX_INSTANCES * 1 );
        for (var i = 0; i < this._MAX_INSTANCES; ++i) {
            /** @type BaseVFXStickerCut */var vfx = BaseVFXStickerCut.add(
                VFXStickerCut1, 'vfx_sticker_1_' + i, this._group
            );
            vfx.init( this );
            this.returnToStickerCutVFXPool( vfx );
        }
    },
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @returns {BaseVFXStickerCut} vfx (in _pool) ready to use
     */
    getStickerCutVFX : function () {
        /** @type BaseVFXStickerCut */var vfx = this._pool.takeOut();
        vfx.reset(); // needs PhaserExtensions.js
//        console.log( 'activate ', vfx.name );
        return vfx;
    },
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @param {BaseVFXStickerCut} vfx is destroyed -> put back into _pool...
     */
    returnToStickerCutVFXPool : function (vfx) {
        vfx.kill(); // needs PhaserExtensions.js
        this._pool.giveBack( vfx );
//        console.log( 'deactivate ', vfx.name );
    },
};