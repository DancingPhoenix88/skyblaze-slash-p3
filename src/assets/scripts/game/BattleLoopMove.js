function BattleLoopMove (goal) {
    this.actors = [];
    this.maxY = goal;
    
    // Use custom PubSub
//    this.events = new PubSub();
//    this.eventActorMiss = new PubSubEvent( 'miss' );
//    // Usage: loopSpawn.events.subscribe( 'miss', obj, func );

    // USE Phaser.Signal
    this.events = {
        miss : new Phaser.Signal()
    }
    // Usage: loopSpawn.events.miss.add( func, obj );
}
//-----------------------------------------------------------------------------------------------------------
BattleLoopMove.prototype = {
    add : function (actor) {
        this.actors.push( actor );
        if (BattleLoopMove.DEBUG_LEVEL >= BattleLoopMoveDebugLevel.ADD_REMOVE) {
            console.log( "[BattleLoopMove] Add ", actor.name );
        }
    },
    //-----------------------------------------------------------------------------------------------------------
    update : function () {
        var deltaTime = game.time.elapsed;
        for (var i = 0 ; i < this.actors.length;) {
            var obj = this.actors[i];
            var a   = obj.data.stats;
            
            if (BattleLoopMove.DEBUG_LEVEL >= BattleLoopMoveDebugLevel.ADD_REMOVE_UPDATE) {
                console.log( "[BattleLoopMove] Translating ", obj.name, " | ", a.getState() );
            }
            
            if (a.getState() == ActorState.FALLING) {
                obj.position.y += a.getSpeed() * deltaTime;
                ++i;
            } else {
                this._removeAt( i );
            }
        }
    },
    //-----------------------------------------------------------------------------------------------------------
    postUpdate : function () {
        for (var i = 0 ; i < this.actors.length; ++i) {
            var obj = this.actors[i];
            var a   = obj.data.stats;
            
            if (BattleLoopMove.DEBUG_LEVEL >= BattleLoopMoveDebugLevel.ADD_REMOVE_UPDATE) {
                console.log( "[BattleLoopMove] Goal-checking ", obj.name, " | ", a.getState(), " @ ", obj.position.y );
            }
            
            if (a.getState() == ActorState.FALLING) {
                if (obj.position.y >= this.maxY) {
                    // Use custom PubSub
//                    this.events.publish( this.eventActorMiss.withData( obj ) );

                    // Use Phaser.Signal
                    this.events.miss.dispatch( obj );
                }
            }
        }
    },
    //-----------------------------------------------------------------------------------------------------------
    _removeAt : function (index) {
        if (BattleLoopMove.DEBUG_LEVEL >= BattleLoopMoveDebugLevel.ADD_REMOVE) {
            console.log( "[BattleLoopMove] Remove ", this.actors[index].name );
        }
        this.actors.splice( index, 1 );
    } 
};
//---------------------------------------------------------------------------------------------------------------
const BattleLoopMoveDebugLevel = Object.freeze({
    'NONE':                 0,
    'ADD_REMOVE':             1,
    'ADD_REMOVE_UPDATE':     2
});
BattleLoopMove.DEBUG_LEVEL = BattleLoopMoveDebugLevel.NONE;