import RecyclePool from "../common/RecyclePool";
import VFXStickerCut1 from "../../prefabs/VFXStickerCut1";
import VFXStickerCut2 from "../../prefabs/VFXStickerCut2";
import VFXStickerCut3 from "../../prefabs/VFXStickerCut3";
import BaseVFXStickerCut from "../prefabs/BaseVFXStickerCut";
import VFXItemPick from "../../prefabs/VFXItemPick";
import VfxFloatingText from "../../prefabs/VfxFloatingText";

class BattleActorPickVFX {
    constructor (scene, actorGroup, vfxGroup) {
        this.scene = scene;
        /**@type Phaser.GameObjects.Container*/this._actorGroup = actorGroup;
        /**@type Phaser.GameObjects.Container*/this._vfxGroup = vfxGroup;
        
        this._vfxCutPools = {};
        /** @type RecyclePool */this._vfxItemPool = null;
        /** @type RecyclePool */this._vfxFloatingTextPool = null;
        
        this._MAX_STICKER_CUT_VFX_PER_TYPE = 20;
        this._MAX_ITEM_PICK = 10;
        this._MAX_FLOATING_TEXTS = 60;
        
        this.init();
    }
    //-----------------------------------------------------------------------------------------------------------
    init () {
        // STICKER CUT
        for (var i = 1; i <= 3; ++i) {
            this._vfxCutPools[i] = new RecyclePool( this._MAX_STICKER_CUT_VFX_PER_TYPE * 1 );
        }
        for (var i = 0; i < this._MAX_STICKER_CUT_VFX_PER_TYPE; ++i) {
            /** @type BaseVFXStickerCut */var vfx = new VFXStickerCut1( this.scene );
            vfx.setName( 'vfx_sticker_1_' + i );
            this._actorGroup.add( vfx );
            vfx.init( this );
            this.returnToStickerCutVFXPool( vfx );
        }
        for (var i = 0; i < this._MAX_STICKER_CUT_VFX_PER_TYPE; ++i) {
            /** @type BaseVFXStickerCut */var vfx = new VFXStickerCut2( this.scene );
            vfx.setName( 'vfx_sticker_2_' + i );
            this._actorGroup.add( vfx );
            vfx.init( this );
            this.returnToStickerCutVFXPool( vfx );
        }
        for (var i = 0; i < this._MAX_STICKER_CUT_VFX_PER_TYPE; ++i) {
            /** @type BaseVFXStickerCut */var vfx = new VFXStickerCut3( this.scene );
            vfx.setName( 'vfx_sticker_3_' + i );
            this._actorGroup.add( vfx );
            vfx.init( this );
            this.returnToStickerCutVFXPool( vfx );
        }
        
        // ITEM PICK
        this._vfxItemPool = new RecyclePool( this._MAX_ITEM_PICK );
        for (var i = 0; i < this._MAX_ITEM_PICK; ++i) {
            /** @type VFXItemPick */var vfx = new VFXItemPick( this.scene );
            vfx.setName( 'vfx_item_pick_' + i );
            this._actorGroup.add( vfx );
            vfx.init( this );
            this.returnToItemPickVFXPool( vfx );
        }
        
        // // FLOATING TEXT
        this._vfxFloatingTextPool = new RecyclePool( this._MAX_FLOATING_TEXTS );
        for (var i = 0; i < this._MAX_FLOATING_TEXTS; ++i) {
            /** @type VfxFloatingText */var vfx = new VfxFloatingText( this.scene );
            this._vfxGroup.add( vfx );
            vfx.init( this );
            this.returnToFloatingTextVFXPool( vfx );
        }
    }
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @returns {BaseVFXStickerCut} vfx (in _vfxCutPools) ready to use
     */
    getStickerCutVFX (segment) {
        /** @type BaseVFXStickerCut */var vfx = this._vfxCutPools[ segment.clamp(1, 3) ].takeOut();
        vfx.setActive( true );
        vfx.setVisible( true );
//        console.log( 'activate ', vfx.name );
        return vfx;
    }
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @param {BaseVFXStickerCut} vfx is destroyed -> put back into _vfxCutPools...
     */
    returnToStickerCutVFXPool (vfx) {
        vfx.setActive( false );
        vfx.setVisible( false );

        var i = 1;
        if (vfx instanceof VFXStickerCut2) {
            i = 2;
        } else if (vfx instanceof VFXStickerCut3) {
            i = 3;
        }
        this._vfxCutPools[i].giveBack( vfx );
//        console.log( 'deactivate ', vfx.name );
    }
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @returns {VFXItemPick} vfx (in _vfxCutPools) ready to use
     */
    getItemPickVFX () {
        /** @type VFXItemPick*/var vfx = this._vfxItemPool.takeOut();
        vfx.setActive( true );
        vfx.setVisible( true );
        return vfx;
    }
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @param {VFXItemPick} vfx is destroyed -> put back into _vfxItemPool
     */
    returnToItemPickVFXPool (vfx) {
        vfx.setActive( false );
        vfx.setVisible( false );
        this._vfxItemPool.giveBack( vfx );
    }
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @returns {VfxFloatingText} vfx (in _vfxFloatingTextPool) ready to use
     */
    getFloatingTextVFX () {
        /***/var vfx = this._vfxFloatingTextPool.takeOut();
        vfx.setActive( true );
        vfx.setVisible( true );
        return vfx;
    }
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @param {VfxFloatingText} vfx is destroyed -> put back into _vfxFloatingTextPool
     */
    returnToFloatingTextVFXPool (vfx) {
        vfx.setActive( false );
        vfx.setVisible( false );
        this._vfxFloatingTextPool.giveBack( vfx );
    }    
}

export default BattleActorPickVFX;