class VfxFloatingText extends Phaser.GameObjects.Container {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);

        var _text = scene.add.text(0.0, 0.0, '+10', {"font":"36px DIN Alternate","fill":"#ffffff"});
        this.add( _text );
        _text.name = 'text';
        _text.setOrigin(0.5, 1.0);
        /** @type Phaser.GameObjects.Text */this.fText = _text;

        scene.add.existing(this);
    }
    //---------------------------------------------------------------------------------------------------------------
    init (pool) {
        this._originalPos = new Phaser.Math. Vector2(
            this.fText.x, this.fText.y
        );
        this._pool = pool;
        
        this._durationAnim = 1 * 1000;
    }
    //---------------------------------------------------------------------------------------------------------------
    setText (text, color = 'white') {
        this.fText.text = text;
        this.fText.setColor( color );
        return this;
    }
    //---------------------------------------------------------------------------------------------------------------
    _prepareForAnimation (obj, pos) {
        // Cancel running (OLD) tweens
        if (this._tween && this._tween.isPlaying()) {
            this.scene.tweens.remove( this._tween );
        }
        
        this.setPosition( pos.x, pos.y ); 
        this.setDepth( obj.depth - 2 );
        
        this.fText.setPosition( 0 );
        this.fText.alpha = 1;
    }
    //---------------------------------------------------------------------------------------------------------------
    animateFor (obj, pos, delay = 0) {
        this._prepareForAnimation( obj, pos );
        if (delay <= 0) {
            this._doAnimate();
        } else {
            this.visible = false;
            this.scene.time.addEvent({
                delay: delay,
                callback: this._doAnimate,
                callbackScope: this
            })
        }
    }
    //---------------------------------------------------------------------------------------------------------------
    _doAnimate () {
        this.setVisible( true );
        this._tween = this.scene.tweens.add({
            targets: this.fText,
            y:{value:-50, duration:this._durationAnim, ease:'Cubic.easeOut'},
            alpha:{value:0, duration:this._durationAnim-400},
            onComplete: this._onCompleteVfx,
            callbackScope: this
        });
    }
    //---------------------------------------------------------------------------------------------------------------
    _onCompleteVfx () {
        this._pool.returnToFloatingTextVFXPool( this );
    }
}

export default VfxFloatingText;