import { GameEvents } from "../game/GameEvents";

export class BaseActor {
    constructor(
        /** @type Phaser.GameObjects.Sprite */sprite,
        /** @type ActorType */type
    ) {
        /** @type Phaser.Events.EventEmitter */this._sceneEvent = sprite.scene.events;
        /** @type Phaser.GameObjects.Sprite */this._sprite = sprite;
        /** @type ActorType */this._type = type;
        /** @type ActorState */this._state = ActorState.INACTIVE;
        this.onSpawn( 1, 0 );

        // Replace this by using scene's EventEmitter
        // this.events = {
        //     pick: new Phaser.Signal()
        // };

        this._sprite.on( 'pointerdown', this._onPick, this );
    }
    //-------------------------------------------------------------------------------------------------------
    getType () { return this._type; }
    //-------------------------------------------------------------------------------------------------------
    getState () { return this._state; }
    //-------------------------------------------------------------------------------------------------------
    getSpeed () { return this._speed; }
    //-------------------------------------------------------------------------------------------------------
    getPoint () { return this._point; }
    //-------------------------------------------------------------------------------------------------------
    isSticker () {
        return (this._type == ActorType.STICKER);
    }
    //-------------------------------------------------------------------------------------------------------
    onSpawn (speed, point) {
        this._state = ActorState.FALLING;
        this._speed = speed;
        this._point = point;
        if (this.isSticker()) {
            if (this._sprite.depth > 50) {
                this._sprite.tint = 0x888888;
                this._sprite.setScale( 0.5 );
            } else {
                this._sprite.tint = 0xffffff;
                this._sprite.setScale( 0.7 );
            }
        }
        this._activate();
    }
    //-------------------------------------------------------------------------------------------------------
    onDestroy () {
        this._state = ActorState.INACTIVE;
        this._deactivate();
    }
    //-------------------------------------------------------------------------------------------------------
    onMiss () {
        this._state = ActorState.MISSING;
        this._deactivate();
    }
    //-------------------------------------------------------------------------------------------------------
    _activate () {
        this._sprite.setInteractive();
    }
    //-------------------------------------------------------------------------------------------------------
    _deactivate () {
        this._sprite.disableInteractive();
    }
    //-------------------------------------------------------------------------------------------------------
    _onPick () {
        if (this._state != ActorState.FALLING) return;
        
        this._state = ActorState.PICKING;
        
        var hitPosition = game.input.activePointer.position;
        var relativeHitPointY = this._sprite.y - hitPosition.y;
        var relativeOffsetY = relativeHitPointY / this._sprite.displayHeight;
        var hitSegment = HitSegment.MIDDLE;
        if (relativeOffsetY < 0.4) hitSegment = HitSegment.LOW;
        else if (relativeOffsetY > 0.7) hitSegment = HitSegment.HIGH;
        
        this._sceneEvent.emit( GameEvents.PICK, this._sprite, hitSegment, hitPosition );
        this._deactivate();
    }
}
//-----------------------------------------------------------------------------------------------------------
export const ActorState = Object.freeze({
    INACTIVE:     0,
    FALLING:      1,
    PICKING:      2,
    MISSING:      3
});
//-----------------------------------------------------------------------------------------------------------
export const ActorType = Object.freeze({
    STICKER:    0,
    ITEM_A:     1,
    ITEM_B:     2,
    ITEM_C:     3,
    ITEM_D:     4,
    ITEM_E:     5
});
//-----------------------------------------------------------------------------------------------------------
export const HitSegment = Object.freeze({
    MIDDLE: 1,
    HIGH:   2,
    LOW:    3
});