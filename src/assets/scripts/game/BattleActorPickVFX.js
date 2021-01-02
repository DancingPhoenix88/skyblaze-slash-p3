function BattleActorPickVFX (actorGroup, vfxGroup) {
    this.add = game.state.getCurrentState().add;
    this._actorGroup = actorGroup;
    this._vfxGroup = vfxGroup;
    
    this._vfxCutPools = {};
    this._vfxItemPool = null;
    this._vfxFloatingTextPool = null;
    
    this._MAX_STICKER_CUT_VFX_PER_TYPE = 20;
    this._MAX_ITEM_PICK = 10;
    this._MAX_FLOATING_TEXTS = 60;
    
    this.init();
}
//-----------------------------------------------------------------------------------------------------------
BattleActorPickVFX.prototype = {
    init : function () {
        // STICKER CUT
        for (var i = 1; i <= 3; ++i) {
            this._vfxCutPools[i] = new RecyclePool( this._MAX_STICKER_CUT_VFX_PER_TYPE * 1 );
        }
        for (var i = 0; i < this._MAX_STICKER_CUT_VFX_PER_TYPE; ++i) {
            /** @type BaseVFXStickerCut */var vfx = BaseVFXStickerCut.add(
                VFXStickerCut1, 'vfx_sticker_1_' + i, this._actorGroup
            );
            vfx.init( this );
            this.returnToStickerCutVFXPool( vfx );
        }
        for (var i = 0; i < this._MAX_STICKER_CUT_VFX_PER_TYPE; ++i) {
            /** @type BaseVFXStickerCut */var vfx = BaseVFXStickerCut.add(
                VFXStickerCut2, 'vfx_sticker_2_' + i, this._actorGroup
            );
            vfx.init( this );
            this.returnToStickerCutVFXPool( vfx );
        }
        for (var i = 0; i < this._MAX_STICKER_CUT_VFX_PER_TYPE; ++i) {
            /** @type BaseVFXStickerCut */var vfx = BaseVFXStickerCut.add(
                VFXStickerCut3, 'vfx_sticker_3_' + i, this._actorGroup
            );
            vfx.init( this );
            this.returnToStickerCutVFXPool( vfx );
        }
        
        // ITEM PICK
        this._vfxItemPool = new RecyclePool( this._MAX_ITEM_PICK );
        for (var i = 0; i < this._MAX_ITEM_PICK; ++i) {
            /** @type VFXItemPick */var vfx = game.add.vfxItem( this._actorGroup, false );
            vfx.name = 'vfx_item_pick_' + i;
            vfx.init( this );
            this.returnToItemPickVFXPool( vfx );
        }
        
        // FLOATING TEXT
        this._vfxFloatingTextPool = new RecyclePool( this._MAX_FLOATING_TEXTS );
        for (var i = 0; i < this._MAX_FLOATING_TEXTS; ++i) {
            /** @type VfxFloatingText */var vfx = game.add.vfxFloatingText( this._vfxGroup, 'vfx_floating_text_' + i );
            vfx.init( this );
            this.returnToFloatingTextVFXPool( vfx );
        }
    },
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @returns {BaseVFXStickerCut} vfx (in _vfxCutPools) ready to use
     */
    getStickerCutVFX : function (segment) {
        /** @type BaseVFXStickerCut */var vfx = this._vfxCutPools[ segment.clamp(1, 3) ].takeOut();
        vfx.reset(); // needs PhaserExtensions.js
//        console.log( 'activate ', vfx.name );
        return vfx;
    },
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @param {BaseVFXStickerCut} vfx is destroyed -> put back into _vfxCutPools...
     */
    returnToStickerCutVFXPool : function (vfx) {
        vfx.kill(); // needs PhaserExtensions.js
        var i = 1;
        if (vfx instanceof VFXStickerCut2) {
            i = 2;
        } else if (vfx instanceof VFXStickerCut3) {
            i = 3;
        }
        this._vfxCutPools[i].giveBack( vfx );
//        console.log( 'deactivate ', vfx.name );
    },
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @returns {VFXItemPick} vfx (in _vfxCutPools) ready to use
     */
    getItemPickVFX : function () {
        return this._vfxItemPool.takeOut().reset(0,0);
    },
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @param {VFXItemPick} vfx is destroyed -> put back into _vfxItemPool
     */
    returnToItemPickVFXPool : function (vfx) {
        vfx.kill();
        this._vfxItemPool.giveBack( vfx );
    },
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @returns {VfxFloatingText} vfx (in _vfxFloatingTextPool) ready to use
     */
    getFloatingTextVFX : function () {
        return this._vfxFloatingTextPool.takeOut().reset(); // needs PhaserExtensions.js
    },
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @param {VfxFloatingText} vfx is destroyed -> put back into _vfxFloatingTextPool
     */
    returnToFloatingTextVFXPool : function (vfx) {
        vfx.kill(); // needs PhaserExtensions.js
        this._vfxFloatingTextPool.giveBack( vfx );
    },
};
