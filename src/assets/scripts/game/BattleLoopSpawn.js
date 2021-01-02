function BattleLoopSpawn (actorsGroup ) {
    this.add = game.state.getCurrentState().add;
    this._group = actorsGroup;
    var data = game.data.level;
    
    this.avgStickerSpeed = 1400.0 / (data.falling_duration * Phaser.Timer.SECOND);
    this.avgStickerInterval = data.spawn_interval * Phaser.Timer.SECOND;
    this.nextStickerSpawn = -1;
    this._MAX_STICKERS = 10;
    this._stickersPool = null;
    
    if (data.items.length > 0) {
	    this.itemsAvailable = data.items.split('-');
	    this.avgItemSpeed = 1400.0 / (data.item_falling_duration * Phaser.Timer.SECOND);
	    this.avgItemInterval = data.item_spawn_interval * Phaser.Timer.SECOND;
	    this._MAX_ITEMS = 5;
	    this._itemsPool = null;
	    this.nextItemSpawn = -1;
	    console.log( this.itemsAvailable );
    } else {
    	this.nextItemSpawn = Number.MAX_VALUE;
    }
    
    // Use custom PubSub
//    this.events = new PubSub();
//    this.eventSpawn = new PubSubEvent( 'spawn' );
//    // Usage: loopSpawn.events.subscribe( 'spawn', obj, func );

    // USE Phaser.Signal
    this.events = {
        spawn : new Phaser.Signal()
    }
    // Usage: loopSpawn.events.spawn.add( func, obj );
    
    this.init();
}
//-----------------------------------------------------------------------------------------------------------
BattleLoopSpawn.prototype = {
    init : function () {
        this._initPoolOfStickers();
        if (this.nextItemSpawn < 0) this._initPoolOfItems();
    },
    //-----------------------------------------------------------------------------------------------------------
    /**
     * Create all stickers needed for the game and put them in a _stickersPool for re-using later
     */
    _initPoolOfStickers : function () {
        this._stickersPool = new RecyclePool( this._MAX_STICKERS );
        for (var i = 0; i < this._MAX_STICKERS; ++i) {
            /** @type Sticker */ var sticker = this.add.sticker( this._group, false );
            sticker.data = {
                id : i, // for debug only
                stats: new BaseActor( sticker, ActorType.STICKER )
            };
            sticker.name = 'sticker_' + i; // to view in Phaser.Plugin.Debug.SceneTree
            this.returnToPool( sticker );
        }
    },
  //-----------------------------------------------------------------------------------------------------------
    /**
     * Create all items needed for the game and put them in a _itemsPool for re-using later
     */
    _initPoolOfItems : function () {
        this._itemsPool = new RecyclePool( this._MAX_ITEMS );
        for (var i = 0; i < this._MAX_ITEMS; ++i) {
            /** @type Item */ var item = this.add.item( this._group, false );
            item.data = {
                id : i, // for debug only
                stats: new BaseActor( item, ActorType.ITEM )
            };
            item.name = 'item_' + i; // to view in Phaser.Plugin.Debug.SceneTree
            this.returnToPool( item );
        }
    },
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @returns {Phaser.Sprite} Sticker (in _stickersPool) ready to use
     */
    _getStickerFromPool : function () {
        return this._stickersPool.takeOut().reset(0, 0);
    },
  //-----------------------------------------------------------------------------------------------------------
    /**
     * @returns {Phaser.Sprite} Item (in _itemsPool) ready to use
     */
    _getItemFromPool : function () {
        return this._itemsPool.takeOut().reset(0, 0);
    },
    //-----------------------------------------------------------------------------------------------------------
    /**
     * @param actorWrapper : This actor is destroyed -> put back into poolOf...
     */
    returnToPool : function (actorWrapper) {
        actorWrapper.kill();
        
        /** @type BaseActor */ var actor = actorWrapper.data.stats;  
        actor.onDestroy();
        if (actor.isSticker()) this._stickersPool.giveBack( actorWrapper );
        else this._itemsPool.giveBack( actorWrapper );
    },
    //-----------------------------------------------------------------------------------------------------------
    update : function () {
        var t = game.time.now;
        
        if (t >= this.nextStickerSpawn) {
            this._doSpawnSticker();
            var nextSpawnAfter = this.avgStickerInterval * randomRange( 0.9, 1.1 );
            this.nextStickerSpawn = t + nextSpawnAfter;
        }
        
        if (t >= this.nextItemSpawn) {
            this._doSpawnItem();
            var nextSpawnAfter = this.avgItemInterval * randomRange( 0.9, 1.1 );
            this.nextItemSpawn = t + nextSpawnAfter;
        }
    },
    //-----------------------------------------------------------------------------------------------------------
    _doSpawnSticker : function () {
        /** @type Sticker */ var sticker = this._getStickerFromPool();
        sticker.position.set( randomRange(0, 500), 0 );
        sticker.z = randomRange( 0, 100 );
        sticker.data.stats.onSpawn( this.avgStickerSpeed * randomRange( 0.9, 1.1 ), 10 );
//        console.log( "Spawn sticker at ", sticker.position );
        
        // Use custom PubSub
//        this.events.publish( this.eventSpawn.withData( sticker ) );
        
        // USE Phaser.Signal
        this.events.spawn.dispatch( sticker );
    },
  //-----------------------------------------------------------------------------------------------------------
    _doSpawnItem : function () {
        /** @type Item */ var item = this._getItemFromPool();
        item.position.set( randomRange(0, 500), 0 );
        item.z = randomRange( 0, 100 );
        item.data.stats.onSpawn( this.avgItemSpeed * randomRange( 0.9, 1.1 ) );
        var itemType = parseInt( Phaser.ArrayUtils.getRandomItem(this.itemsAvailable) );
        item.setType( itemType );
        console.log( "Spawn item ", item.data.stats.getType(), ' ', item.data.stats.getPoint(), 'pt @ ', item.position );

        // Use custom PubSub
//        this.events.publish( this.eventSpawn.withData( item ) );
        
        // USE Phaser.Signal
        this.events.spawn.dispatch( item );
    }
};