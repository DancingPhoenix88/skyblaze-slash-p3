import { ActorState, BaseActor } from "../prefabs/BaseActor";
import { GameEvents } from "./GameEvents";

class BattleLoopMove {
    constructor(scene, goal) {
        /** @type Phaser.Scene */this.scene = scene;
        this.actors = [];
        this.maxY = goal;
        this.DEBUG_LEVEL = BattleLoopMoveDebugLevel.NONE;
    }
    //-----------------------------------------------------------------------------------------------------------
    add (actor) {
        this.actors.push( actor );
        if (this.DEBUG_LEVEL >= BattleLoopMoveDebugLevel.ADD_REMOVE) {
            console.log( "[BattleLoopMove] Add ", actor.name );
        }
    }
    //-----------------------------------------------------------------------------------------------------------
    update (now, deltaTime) {
        for (var i = 0 ; i < this.actors.length;) {
            /** @type Phaser.GameObjects.Sprite */var obj = this.actors[i];
            /** @type BaseActor*/var a   = obj.data.get('stats');
            
            if (this.DEBUG_LEVEL >= BattleLoopMoveDebugLevel.ADD_REMOVE_UPDATE) {
                console.log( "[BattleLoopMove] Translating ", obj.name, " | ", a.getState() );
            }
            
            if (a.getState() == ActorState.FALLING) {
                obj.y += a.getSpeed() * deltaTime;
                ++i;
            } else {
                this._removeAt( i );
            }
        }
    }
    //-----------------------------------------------------------------------------------------------------------
    postUpdate () {
        for (var i = 0 ; i < this.actors.length; ++i) {
            /** @type Phaser.GameObjects.Sprite */var obj = this.actors[i];
            /** @type BaseActor*/var a   = obj.data.get('stats');
            
            if (this.DEBUG_LEVEL >= BattleLoopMoveDebugLevel.ADD_REMOVE_UPDATE) {
                console.log( "[BattleLoopMove] Goal-checking ", obj.name, " | ", a.getState(), " @ ", obj.position.y );
            }
            
            if (a.getState() == ActorState.FALLING) {
                if (obj.y >= this.maxY) {
                    this.scene.events.emit( GameEvents.MISS, obj );
                }
            }
        }
    }
    //-----------------------------------------------------------------------------------------------------------
    _removeAt (index) {
        if (this.DEBUG_LEVEL >= BattleLoopMoveDebugLevel.ADD_REMOVE) {
            console.log( "[BattleLoopMove] Remove ", this.actors[index].name );
        }
        this.actors.splice( index, 1 );
    }
}
//---------------------------------------------------------------------------------------------------------------
const BattleLoopMoveDebugLevel = Object.freeze({
    'NONE':                 0,
    'ADD_REMOVE':           1,
    'ADD_REMOVE_UPDATE':    2
});
//---------------------------------------------------------------------------------------------------------------
export default BattleLoopMove;