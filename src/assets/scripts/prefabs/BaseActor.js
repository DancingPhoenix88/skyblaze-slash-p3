"use strict";

function BaseActor (sprite, type) {
    this._sprite = sprite;
    this._type = type;
    this.onSpawn( 1, 0 );
    this.events = {
        pick: new Phaser.Signal()
    };
    this._sprite.events.onInputDown.add( this._onPick, this );
}
//-----------------------------------------------------------------------------------------------------------
BaseActor.prototype = {
    getType : function () { return this._type; },
    //-------------------------------------------------------------------------------------------------------
    getState : function () { return this._state; },
    //-------------------------------------------------------------------------------------------------------
    getSpeed : function () { return this._speed; },
  //-------------------------------------------------------------------------------------------------------
    getPoint : function () { return this._point; },
    //-------------------------------------------------------------------------------------------------------
    isSticker : function () {
        return (this._type == ActorType.STICKER);
    },
    //-------------------------------------------------------------------------------------------------------
    onSpawn : function (speed, point) {
        this._state = ActorState.FALLING;
        this._speed = speed;
        this._point = point;
        if (this.isSticker()) {
            if (this._sprite.z > 50) {
                this._sprite.tint = 0x888888;
                this._sprite.scale.set( 0.5 );
            } else {
                this._sprite.tint = 0xffffff;
                this._sprite.scale.set( 0.7 );
            }
        }
        this._activate();
    },
    //-------------------------------------------------------------------------------------------------------
    onDestroy : function () {
        this._state = ActorState.INACTIVE;
        this._deactivate();
    },
    //-------------------------------------------------------------------------------------------------------
    onMiss : function () {
        this._state = ActorState.MISSING;
        this._deactivate();
    },
    //-------------------------------------------------------------------------------------------------------
    _activate : function () {
        this._sprite.inputEnabled = true;
    },
    //-------------------------------------------------------------------------------------------------------
    _deactivate : function () {
        this._sprite.inputEnabled = false;
        this.events.pick.removeAll();
    },
    //-------------------------------------------------------------------------------------------------------
    _onPick : function () {
        if (this._state != ActorState.FALLING) return;
        
        this._state = ActorState.PICKING;
        
        var hitPosition = game.input.position;
        var relativeHitPoint = Phaser.Point.subtract( this._sprite.worldPosition, hitPosition );
        var relativeOffsetY = relativeHitPoint.y / this._sprite.height;
        var hitSegment = HIT_SEGMENT_MIDDLE;
        if (relativeOffsetY < 0.4) hitSegment = HIT_SEGMENT_LOW;
        else if (relativeOffsetY > 0.7) hitSegment = HIT_SEGMENT_HIGH;
        
        this.events.pick.dispatch( this._sprite, hitSegment, hitPosition );
        this._deactivate();
    }
};
//-----------------------------------------------------------------------------------------------------------
const ActorState = Object.freeze({
    "INACTIVE":     0,
    "FALLING":      1,
    "PICKING":      2,
    "MISSING":      3
});
//-----------------------------------------------------------------------------------------------------------
const ActorType = Object.freeze({
    "STICKER":    0,
    "ITEM_A":     1,
    "ITEM_B":     2,
    "ITEM_C":     3,
    "ITEM_D":     4,
    "ITEM_E":     5
});
const HIT_SEGMENT_MIDDLE = 1;
const HIT_SEGMENT_HIGH   = 2;
const HIT_SEGMENT_LOW    = 3;