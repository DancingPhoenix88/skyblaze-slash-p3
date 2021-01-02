// CONSTANTS
//Battle.prototype.SPAWN_INTERVAL_MIN = 0.5;
//Battle.prototype.SPAWN_INTERVAL_MAX = 2;
//-----------------------------------------------------------------------------------------------------------
const BattlePhase = Object.freeze({
    'PREPARING' : 0,
    'PLAYING'   : 1,
    'WIN'       : 2,
    'TIME_OUT'  : 3,
    'LOSE'      : 4,
    'PAUSING'   : 5
});
//-----------------------------------------------------------------------------------------------------------
// CONFIG
Battle.prototype.MAX_HIT_COUNT          = 8;
//-----------------------------------------------------------------------------------------------------------
// PROPERTIES
Battle.prototype.isGrabbing             = false;
Battle.prototype.mapOfConnectFxs        = [];
Battle.prototype.phase                  = BattlePhase.PREPARING;
Battle.prototype.hitCount               = 0;
//-----------------------------------------------------------------------------------------------------------
/**
 * Initialize everything
 */
Battle.prototype.initStage = function () {
    this.phase = BattlePhase.PREPARING;
    
    // Init data
    this.game.data.level = MasterData.Singleton.getById( 'stage', this.game.data.userLevel );
    console.log( this.game.data.level );
    if (this.game.data.level == null) {
    	console.error( 'level data not found' );
    	this.state.start( 'Home', FadeOut, FadeIn );
    	return;
    }
    
    this.hitCount = 0;
    
    // Init controllers
    this.loopSpawn = new BattleLoopSpawn( this.fActorGroup );
    this.loopMove = new BattleLoopMove( this.fGoalLine.position.y );
    this.vfxActorPick = new BattleActorPickVFX( this.fActorGroup, this.fVfxGroup );
    this.pointManager = PointManager.Singleton;
    this.powerManager = PowerManager.Singleton;
    this.timer = new BattleTimer();
    
    // Init events
    this.pointManager.clearEvents(); // because it is Singleton -> there might be Battle instnce subscribed to it already
    this.powerManager.clearEvents(); // because it is Singleton -> there might be Battle instnce subscribed to it already
    this.powerManager._reset();
    this.loopSpawn.events.spawn.add( this.onSpawn, this );
    this.loopMove.events.miss.add( this.onMiss, this );
    this.timer.events.timeOut.addOnce( this.onTimeOut, this );
    this.events = {
        hit : new Phaser.Signal()
    };
    
    // Init UI
    this.ui = new BattleUI( this );
    
    // Start
    this.timer.start();
    this.phase = BattlePhase.PLAYING;
};
//-----------------------------------------------------------------------------------------------------------
Battle.prototype.update = function () { // Auto-called by Phaser.State
    if (this.phase == BattlePhase.PLAYING) {
        this.loopSpawn.update();        // Spawn new actors
        this.loopMove.update();          // Move actors
        this.loopMove.postUpdate();     // Check if actors reaching goal
        
        this.fActorGroup.sort();         // Ensure sprites are rendered with correct order
    }
};
//-----------------------------------------------------------------------------------------------------------
Battle.prototype.onSpawn = function (actorWrapper) {
//    console.log( 'on spawn event', actorWrapper );
    this.loopMove.add( actorWrapper );
    /** @type BaseActor */var actor = actorWrapper.data.stats;
    actor.events.pick.add( this.onPick, this );
};
//-----------------------------------------------------------------------------------------------------------
Battle.prototype.onMiss = function (actorWrapper) {
//    console.log( 'on miss event', actorWrapper );
    /** @type BaseActor */var actor = actorWrapper.data.stats;
    actor.onMiss(); // It will be removed from LoopMove in the next 'update'
    this.loopSpawn.returnToPool( actorWrapper );
    
    if (actor.isSticker() == false) return;
    
    ++this.hitCount;
    this.events.hit.dispatch( this.hitCount );
    
    if (this.hitCount >= this.MAX_HIT_COUNT) {
        this.onLose();
    }
};
//-----------------------------------------------------------------------------------------------------------
Battle.prototype.onTimeOut = function () {
    console.log( 'on time out' );
    this.phase = BattlePhase.TIME_OUT;
    
    this.state.start( 'Win', FadeOut, FadeIn );
};
//-----------------------------------------------------------------------------------------------------------
Battle.prototype.onPick = function (actorWrapper, hitSegment, hitPosition) {
//    console.log( 'on pick', actorWrapper );
    
    /** @type BaseActor */var actor = actorWrapper.data.stats;
    var point = actor.getPoint();
    var multiplier = this.pointManager.getMultiplier();
    
    if (actor.isSticker()) {
        this.pointManager.addPoint( point );
        
        //VFX
        this.vfxActorPick
            .getStickerCutVFX( hitSegment )
            .animateFor( actorWrapper );
        if (multiplier <= 1) {
            this.vfxActorPick
                .getFloatingTextVFX()
                .setText( '+' + point, '#ffffff' )
                .animateFor( actorWrapper, hitPosition );
        } else {
            for (var i = 0; i < multiplier; ++i) {
                var p = hitPosition.clone(p);
                p.x += randomRange(-30, 30);
                this.vfxActorPick
                    .getFloatingTextVFX()
                    .setText( '+' + point, '#ffff00' )
                    .animateFor( actorWrapper, p, 0.1 * i * Phaser.Timer.SECOND );
            }
        }
    } else {
        this.powerManager.addPoint( point );
        this.vfxActorPick
            .getItemPickVFX()
            .animateFor( actorWrapper );
    }
    
    this.loopSpawn.returnToPool( actorWrapper );
};
//-----------------------------------------------------------------------------------------------------------
Battle.prototype.onLose = function () {
    console.log( 'LOSE' );
    this.phase = BattlePhase.LOSE;
    
    this.state.start( 'Lose', FadeOut, FadeIn );
};