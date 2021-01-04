import Sticker from '../../prefabs/Sticker';
import Item from '../../prefabs/Item';
import RecyclePool from '../common/RecyclePool';
import { BaseActor,ActorState,ActorType } from '../prefabs/BaseActor';
import { randomRange } from '../common/PhaserExtensions';
import { GameEvents } from './GameEvents';

class BattleLoopSpawn {
    constructor (scene, actorsGroup) {
        /** @type Phaser.Scene */this.scene = scene;
        this._group = actorsGroup;
        var data = game.registry.get( 'level' );
        
        this.avgStickerSpeed    = 1400.0 / (data.falling_duration * 1000);
        this.avgStickerInterval = data.spawn_interval * 1000;
        this.nextStickerSpawn   = -1;
        this._MAX_STICKERS      = 10;
        this._stickersPool      = null;
        
        if (data.items.length > 0) {
            this.itemsAvailable  = data.items.split('-');
            this.avgItemSpeed    = 1400.0 / (data.item_falling_duration * 1000);
            this.avgItemInterval = data.item_spawn_interval * 1000;
            this._MAX_ITEMS      = 5;
            this._itemsPool      = null;
            this.nextItemSpawn   = -1;
            this.rand = new Phaser.Math.RandomDataGenerator();
            console.log( this.itemsAvailable );
        } else {
            this.nextItemSpawn = Number.MAX_VALUE;
        }

        // Replace this by using scene's EventEmitter
        // this.events = {
        //     spawn : new Phaser.Signal()
        // }

        this.init();
    }
    //-----------------------------------------------------------------------------------------------------------
    init () {
        this._initPoolOfStickers();
        if (this.nextItemSpawn < 0) this._initPoolOfItems();
    }
    //-----------------------------------------------------------------------------------------------------------
    /**
     * Create all stickers needed for the game and put them in a _stickersPool for re-using later
     */
    _initPoolOfStickers () {
        this._stickersPool = new RecyclePool( this._MAX_STICKERS );
        for (var i = 0; i < this._MAX_STICKERS; ++i) {
            /** @type Sticker */ var sticker = new Sticker( this.scene );
            this._group.add( sticker );
            sticker.setDataEnabled();
            sticker.data.set( 'id', i );
            sticker.data.set( 'stats', new BaseActor( sticker, ActorType.STICKER ) );
            sticker.setName( 'sticker_' + i ); // to view in Phaser.Plugin.Debug.SceneTree
            this.returnToPool( sticker );
        }
    }
  //-----------------------------------------------------------------------------------------------------------
    /**
     * Create all items needed for the game and put them in a _itemsPool for re-using later
     */
    _initPoolOfItems () {
        this._itemsPool = new RecyclePool( this._MAX_ITEMS );
        for (var i = 0; i < this._MAX_ITEMS; ++i) {
            /** @type Item */ var item = new Item( this.scene );
            this._group.add( item );
            item.setDataEnabled();
            item.data.set( 'id', i );
            item.data.set( 'stats', new BaseActor( item, ActorType.item ) );
            item.setName( 'item_' + i );// to view in Phaser.Plugin.Debug.SceneTree
            this.returnToPool( item );
        }
    }
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @returns {Sticker} Sticker (in _stickersPool) ready to use
     */
    _getStickerFromPool () {
        /** @type Sticker */var s = this._stickersPool.takeOut();
        s.setActive( true );
        s.setVisible( true );
        return s;
    }
  //-----------------------------------------------------------------------------------------------------------
    /**
     * @returns {Item} Item (in _itemsPool) ready to use
     */
    _getItemFromPool () {
        /** @type Item */var i = this._itemsPool.takeOut();
        i.setActive( true );
        i.setVisible( true );
        return i;
    }
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @param actorWrapper : This actor is destroyed -> put back into poolOf...
     */
    returnToPool (actorWrapper) {
        actorWrapper.setActive( false );
        actorWrapper.setVisible( false );
        
        /** @type BaseActor */ var actor = actorWrapper.data.get( 'stats' );
        actor.onDestroy();
        if (actor.isSticker()) this._stickersPool.giveBack( actorWrapper );
        else this._itemsPool.giveBack( actorWrapper );
    }
    //-----------------------------------------------------------------------------------------------------------
    update (now, deltaTime) {
        if (now >= this.nextStickerSpawn) {
            this._doSpawnSticker();
            var nextSpawnAfter = this.avgStickerInterval * randomRange( 0.9, 1.1 );
            this.nextStickerSpawn = now + nextSpawnAfter;
        }
        
        if (now >= this.nextItemSpawn) {
            this._doSpawnItem();
            var nextSpawnAfter = this.avgItemInterval * randomRange( 0.9, 1.1 );
            this.nextItemSpawn = now + nextSpawnAfter;
        }
    }
    //-----------------------------------------------------------------------------------------------------------
    _doSpawnSticker () {
        /** @type Sticker */ var sticker = this._getStickerFromPool();
        sticker.setPosition( randomRange(0, 500), 0 );
        sticker.setDepth( randomRange( 0, 100 ) );
        /** @type BaseActor */ var actor = sticker.data.get( 'stats' );
        actor.onSpawn( this.avgStickerSpeed * randomRange( 0.9, 1.1 ), 10 );
        this.scene.events.emit( GameEvents.SPAWN, sticker );
    }
  //-----------------------------------------------------------------------------------------------------------
    _doSpawnItem () {
        /** @type Item */ var item = this._getItemFromPool();
        item.setPosition( randomRange(0, 500), 0 );
        item.setDepth( randomRange( 0, 100 ) );
        /** @type BaseActor */ var actor = item.data.get( 'stats' );
        actor.onSpawn( this.avgItemSpeed * randomRange( 0.9, 1.1 ) );
        var itemType = parseInt( this.rand.pick(this.itemsAvailable) );
        item.setType( itemType );
        this.scene.events.emit( GameEvents.SPAWN, item );
    }
}

export default BattleLoopSpawn;