function BaseVFXStickerCut(aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType) {
    // Copy from generated Group Prefab
    Phaser.Group.call(this, aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType);
//    require this.fSlash
//    require this.fLower 
//    require this.fUpper
}

/** @type Phaser.Group */
var BaseVFXStickerCut_proto = Object.create(Phaser.Group.prototype);
BaseVFXStickerCut.prototype = BaseVFXStickerCut_proto;
BaseVFXStickerCut.prototype.constructor = BaseVFXStickerCut;

//---------------------------------------------------------------------------------------------------------------
BaseVFXStickerCut.prototype.init = function (pool) {
    this._originalUpperPos = this.fUpper.position.clone();
    this._originalLowerPos = this.fLower.position.clone();
    this._pool = pool;
    
    var frames = [
        'empty',
          'slash_frame_01.png', 
          'slash_frame_02.png', 
          'slash_frame_03.png',
          'empty'
      ];
      this.fSlash.animations.add( this.fSlash.name, frames, 30, false, false );
    
    this._durationAnim     = 1 * Phaser.Timer.SECOND;
    this._durationComplete = 1.1 * Phaser.Timer.SECOND;
    this._timer = game.time.create( false ); // Re-use this timer
    this._timer.add( this._durationComplete, this._onCompleteVfx, this );
};
//---------------------------------------------------------------------------------------------------------------
BaseVFXStickerCut.prototype._prepareForAnimation = function (stickerWrapper) {
    // Cancel running (OLD) tweens
    if (this._timer.running) {
        this._timer.stop( false );
        this.game.tweens.removeAll( this, true );
    }
    
    this.position = stickerWrapper.position;
    this.scale    = stickerWrapper.scale;
    this.z        = stickerWrapper.z - 1;
    
    this.fUpper.position.copyFrom( this._originalUpperPos );
    this.fUpper.scale.set( 1 );
    this.fUpper.alpha = 1;
    this.fUpper.angle = 0;
    
    this.fLower.position.copyFrom( this._originalLowerPos );
    this.fLower.scale.set( 1 );
    this.fLower.alpha = 1;
    this.fLower.angle = 0;
};
//---------------------------------------------------------------------------------------------------------------
BaseVFXStickerCut.prototype.animateFor = function (stickerWrapper) {
    this._prepareForAnimation( stickerWrapper );
    var speed    = stickerWrapper.data.stats.getSpeed();
    var DURATION = this._durationAnim;
    var gof      = this.game.add; // GameObjectFactory
    var scaleUpper = randomRange( 0.9, 1.1 );
    var scaleLower = randomRange( 0.9, 1.1 );
    
    this._tweens = [
        gof.tween( this.fUpper )
            .to( {y: this.fUpper.y + speed * randomRange( 100, 200 )}, DURATION, Phaser.Easing.Linear.None, true),
        gof.tween( this.fUpper )
            .to( {x: this.fUpper.x + randomRange( -200, 100 )}, DURATION, Phaser.Easing.Cubic.Out, true),
        gof.tween( this.fUpper.scale )
            .to( {x:scaleUpper, y:scaleUpper}, DURATION, Phaser.Easing.Cubic.Out, true),
        gof.tween( this.fUpper )
            .to( {angle: randomRange( -60, 30 )}, DURATION, Phaser.Easing.Cubic.Out, true),
        gof.tween( this.fUpper )
            .to( {alpha: 0}, DURATION, Phaser.Easing.Cubic.Out, true),
        
        gof.tween( this.fLower )
            .to( {y: this.fLower.y + speed * randomRange( 100, 200 )}, DURATION, Phaser.Easing.Linear.None, true),
        gof.tween( this.fLower )
            .to( {x: this.fLower.x + randomRange( -100, 200 )}, DURATION, Phaser.Easing.Cubic.Out, true),
        gof.tween( this.fLower.scale )
            .to( {x:scaleLower, y:scaleLower}, DURATION, Phaser.Easing.Cubic.Out, true),
        gof.tween( this.fLower )
            .to( {angle: randomRange( -30, 60 )}, DURATION, Phaser.Easing.Cubic.Out, true),
        gof.tween( this.fLower )
            .to( {alpha: 0}, DURATION, Phaser.Easing.Cubic.Out, true),
    ];
    
    this.fSlash.animations.play( this.fSlash.name );
    
    this._timer.start();
    
//    this.game.debug.graph(); // show graph at this moment, to prove that VFX is spawned & activated
};
//---------------------------------------------------------------------------------------------------------------
BaseVFXStickerCut.prototype._onCompleteVfx = function () {
    this._pool.returnToStickerCutVFXPool( this );
};
//---------------------------------------------------------------------------------------------------------------
BaseVFXStickerCut.add = function (constructorFunc, name, parent) {
    // I need to add this to a parent manually (not sure why it didn't work with Group constructor)
    return parent.add(
        new constructorFunc( game, parent, name, true ) // Copy & edit from: Phaser.Group
        , true
    );
    // Usage: BaseVFXStickerCut.add( VFXStickerCut1, name, parent || undefined );
};