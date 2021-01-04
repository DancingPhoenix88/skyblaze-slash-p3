import { randomRange } from '../common/PhaserExtensions';

class BaseVFXStickerCut extends Phaser.GameObjects.Container {
    constructor (scene, x, y, children) {
        super(scene, x, y, children);

        /** @type Phaser.GameObjects.Sprite */this.fUpper;
        /** @type Phaser.GameObjects.Sprite */this.fLower;
        /** @type Phaser.GameObjects.Sprite */this.fSlash;

        scene.add.existing(this);
    }
    //---------------------------------------------------------------------------------------------------------------
    init (pool) {
        this._originalUpperPos = new Phaser.Math. Vector2(
            this.fUpper.x, this.fUpper.y
        );
        this._originalLowerPos = new Phaser.Math. Vector2(
            this.fLower.x, this.fLower.y
        );
        this._pool = pool;
        
        if (!this.scene.anims.exists( 'slash' )) {
            this.scene.anims.create({
                key      : 'slash',
                frames   : [
                    {key:'anim_slash_power', frame:'slash_frame_01.png'},
                    {key:'anim_slash_power', frame:'slash_frame_02.png'},
                    {key:'anim_slash_power', frame:'slash_frame_03.png'}
                ],
                frameRate: 30
            });
        }
        
        this._durationAnim     = 1 * 1000;
        this._durationComplete = 1.1 * 1000;
        this._timerEvent = new Phaser.Time.TimerEvent({
            delay: this._durationComplete,
            callback: this._onCompleteVfx,
            callbackScope: this
        });
    }
    //---------------------------------------------------------------------------------------------------------------
    _prepareForAnimation (/** @type Phaser.GameObjects.Sprite */stickerWrapper) {
        // Cancel running (OLD) tweens
        if (this._tweens && this._tweens[0].isPlaying()) {
            this.scene.tweens.remove( this._tweens[0] );
            this.scene.tweens.remove( this._tweens[1] );
        }
        
        this.copyPosition( stickerWrapper );
        this.setScale( stickerWrapper.scaleX, stickerWrapper.scaleY );
        this.setDepth( stickerWrapper.depth - 1);
        
        this.fUpper.copyPosition( this._originalUpperPos );
        this.fUpper.setScale( 1 );
        this.fUpper.alpha = 1;
        this.fUpper.angle = 0;
        
        this.fLower.copyPosition( this._originalLowerPos );
        this.fLower.setScale( 1 );
        this.fLower.alpha = 1;
        this.fLower.angle = 0;
    }
    //---------------------------------------------------------------------------------------------------------------
    animateFor (/** @type Phaser.GameObjects.Sprite */stickerWrapper) {
        this._prepareForAnimation( stickerWrapper );
        var speed    = stickerWrapper.data.get('stats').getSpeed();
        var tm       = this.scene.tweens;
        
        this._tweens = [
            tm.add({
                targets: this.fUpper,
                duration: this._durationAnim,
                y:{value: this.fUpper.y + speed * randomRange( 100, 200 ), ease:'Linear'},
                x:{value: this.fUpper.x + speed * randomRange( -200, 100 ), ease:'Cubic.easeOut'},
                scale:{value: randomRange( 0.9, 1.1 ), ease:'Cubic.easeOut'},
                angle:{value: randomRange( -60, 30 ), ease:'Cubic.easeOut'},
                alpha:{value: 0, ease:'Cubic.easeOut'},
            }),
            tm.add({
                targets: this.fLower,
                duration: this._durationAnim,
                y:{value: this.fLower.y + speed * randomRange( 100, 200 ), ease:'Linear'},
                x:{value: this.fLower.x + speed * randomRange( -100, 200 ), ease:'Cubic.easeOut'},
                scale:{value: randomRange( 0.9, 1.1 ), ease:'Cubic.easeOut'},
                angle:{value: randomRange( -30, 60 ), ease:'Cubic.easeOut'},
                alpha:{value: 0, ease:'Cubic.easeOut'},
            })
        ];
        
        this.fSlash.play({
            key: 'slash',
            showOnStart: true,
            hideOnComplete: true
        });
        
        this.scene.time.addEvent( this._timerEvent );
        
    //    this.game.debug.graph(); // show graph at this moment, to prove that VFX is spawned & activated
    }
    //---------------------------------------------------------------------------------------------------------------
    _onCompleteVfx () {
        this._pool.returnToStickerCutVFXPool( this );
    }
    //---------------------------------------------------------------------------------------------------------------
    update (time, delta) { // HACK: ??? Phaser not update animation for nested Sprite in an extended class
        this.fSlash.anims.update(time, delta);
    }
}

export default BaseVFXStickerCut;