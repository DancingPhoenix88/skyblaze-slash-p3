
// -- user code here --

/* --- start generated code --- */

// Generated by  1.5.4 (Phaser v2.6.2)


/**
 * Item
 * @param {Phaser.Game} aGame A reference to the currently running game.
 * @param {Number} aX The x coordinate (in world space) to position the Sprite at.
 * @param {Number} aY The y coordinate (in world space) to position the Sprite at.
 * @param {any} aKey This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
 * @param {any} aFrame If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
 */
function Item(aGame, aX, aY, aKey, aFrame) {
    Phaser.Sprite.call(this, aGame, aX, aY, aKey || 'actors', aFrame == undefined || aFrame == null? 'item-a' : aFrame);
    this.name = 'item';
    this.anchor.set(0.0, 1.0);
    var _anim_a = this.animations.add('a', ['item-a'], 1, false);
    this.animations.add('b', ['item-b'], 1, false);
    this.animations.add('c', ['item-c'], 1, true);
    this.animations.add('d', ['item-d'], 1, false);
    this.animations.add('e', ['item-e'], 1, false);
    _anim_a.play();
    
    // fields
    
    this.fItem = this;
    
}

/** @type Phaser.Sprite */
var Item_proto = Object.create(Phaser.Sprite.prototype);
Item.prototype = Item_proto;
Item.prototype.constructor = Item;

/* --- end generated code --- */
// -- user code here --
Phaser.GameObjectFactory.prototype.item = function (group, exists) {
    // Copy & edit from: Phaser.Group.prototype.create
    if (exists === undefined) { exists = true; }
    var i = new Item( this.game, 0, 0 );
    i.exists  = exists;
    i.visible = exists;
    i.alive   = exists;
    return group.add( i, false );
};

//                 -         A          B          C          D          E
var ItemPointMap =     [0,     1,         2,         2,         3,         3  ];
var ItemSpriteMap = ['',     'a',     'b',     'c',     'd',     'e'];

Item.prototype.setType = function (type) {
    type = Math.floor( type.clamp(1,5) );
    
    /** @type BaseActor */var actor = this.data.stats;
    actor._type = type;
    actor._point = ItemPointMap[ type ];
    
    this.fItem.animations.play( ItemSpriteMap[ type ] );
}