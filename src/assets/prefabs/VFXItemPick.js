class VFXItemPick extends Phaser.GameObjects.Sprite {
    constructor (scene, x = 0, y = 0, texture = 'anim_item_vfx', frame = 0) {
        super( scene, x, y, texture, frame );

        this.setOrigin( 0.2760233739663286, 0.7558479532163742 );

        if (!this.scene.anims.exists( 'item_vfx_idle' )) {
            this.scene.anims.create({
                key   : 'item_vfx_idle',
                frames: this.scene.anims.generateFrameNumbers('anim_item_vfx', {frames:[35]})
            });
            this.scene.anims.create({
                key   : 'item_vfx_active',
                frames: this.scene.anims.generateFrameNumbers('anim_item_vfx', {start:0, end:35}),
                frameRate: 60
            });
        }

        this.play( 'item_vfx_idle' );

        this._timerEvent = new Phaser.Time.TimerEvent({
            delay: 600,
            callback: this._onCompleteVfx,
            callbackScope: this
        });
    }
    //---------------------------------------------------------------------------------------------------------------
    init (pool) {
        this._pool = pool;
    }
    //---------------------------------------------------------------------------------------------------------------
    animateFor (itemWrapper) {
        this.copyPosition( itemWrapper );
        this.setDepth( itemWrapper.depth - 1 );
        this.play( 'item_vfx_active' );
        this.scene.time.addEvent( this._timerEvent );
    }
    //---------------------------------------------------------------------------------------------------------------
    _onCompleteVfx () {
        this._pool.returnToItemPickVFXPool( this );
    }
    //---------------------------------------------------------------------------------------------------------------
    update (time, delta) { // HACK: ??? Phaser not update animation for nested Sprite in an extended class
        this.anims.update(time, delta);
    }
}

export default VFXItemPick;