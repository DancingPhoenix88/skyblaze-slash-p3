
// -- user code here --

/* --- start generated code --- */

// Generated by  1.5.4 (Phaser v2.6.2)


/**
 * Sticker
 * @param {Phaser.Game} aGame A reference to the currently running game.
 * @param {Number} aX The x coordinate (in world space) to position the Sprite at.
 * @param {Number} aY The y coordinate (in world space) to position the Sprite at.
 * @param {any} aKey This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
 * @param {any} aFrame If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
 */
function Sticker(aGame, aX, aY, aKey, aFrame) {
    Phaser.Sprite.call(this, aGame, aX, aY, aKey || 'actors', aFrame == undefined || aFrame == null? 'sticker' : aFrame);
    this.anchor.set(0.0, 1.0);
    
}

/** @type Phaser.Sprite */
var Sticker_proto = Object.create(Phaser.Sprite.prototype);
Sticker.prototype = Sticker_proto;
Sticker.prototype.constructor = Sticker;

/* --- end generated code --- */
// -- user code here --
Phaser.GameObjectFactory.prototype.sticker = function (group, exists) {
    // Copy & edit from: Phaser.Group.prototype.create
    if (exists === undefined) { exists = true; }
    var s = new Sticker( this.game, 0, 0 );
    s.exists  = exists;
    s.visible = exists;
    s.alive   = exists;
    return group.add( s, false );
};