import { numberWithCommas } from '../scripts/common/PhaserExtensions';
import PointManager from '../scripts/game/PointManager';

class Lose extends Phaser.Scene {
    constructor () {
        super();
    }
    //-----------------------------------------------------------------------------------------------------------
    preload () {
        this.load.pack( 'pack_result', './src/assets/pack_result.json', 'result' );
    }
    //-----------------------------------------------------------------------------------------------------------
    create () {
        var _bg = this.add.sprite(310.0, 569.0, 'battle_ui', 'white');
        _bg.name = 'bg';
        _bg.setScale(50.0, 50.0);
        _bg.setOrigin(0.5, 0.5);
        _bg.tint = 0x9dd3ee;
        
        var _btnNextBg = this.add.sprite(323.0, 856.0, 'battle_ui', 'white');
        _btnNextBg.name = 'btnNextBg';
        _btnNextBg.setScale(16.90493724986447, 3.0);
        _btnNextBg.alpha = 0.9;
        _btnNextBg.setOrigin(0.5, 0.5);
        _btnNextBg.setInteractive({ useHandCursor:true })
            .on( 'pointerdown', this.toNextLevel, this );
        
        var _btnNextText = this.add.text(320.0, 856.0, 'HOME', {"font":"32px DIN Alternate","fill":"#14385a","align":"center"});
        _btnNextText.name = 'btnNextText';
        _btnNextText.setOrigin(0.5, 0.5);
        
        var _lightBeam = this.add.sprite(331.0, 379.0, 'light_beam');
        _lightBeam.name = 'lightBeam';
        _lightBeam.setOrigin(0.5, 0.5);
        _lightBeam.tint = 0xfeffff;
        
        var _panelComplete = this.add.sprite(310.0, 569.0, 'panel_win');
        _panelComplete.name = 'panelComplete';
        _panelComplete.setOrigin(0.5, 0.5);
        _panelComplete.tint = 0xfeffff;
        
        var _txtStage = this.add.text(320.0, 514.0, 'STAGE 1', {"font":"48px DIN Alternate","fill":"#feffff","align":"center"});
        _txtStage.name = 'txtStage';
        _txtStage.setOrigin(0.5, 0.5);
        
        var _labelPoint = this.add.text(320.0, 627.0, 'Points', {"font":"32px DIN Alternate","fill":"#feffff","align":"center"});
        _labelPoint.name = 'labelPoint';
        _labelPoint.setOrigin(0.5, 0.5);
        
        var _txtPoint = this.add.text(320.0, 701.0, '54,200', {"font":"64px DIN Alternate","fill":"#feffff","align":"center"});
        _txtPoint.name = 'txtPoint';
        _txtPoint.setOrigin(0.5, 0.5);
        
        var _labelLose = this.add.sprite(320.0, 379.0, 'label_win');
        _labelLose.name = 'labelLose';
        _labelLose.setOrigin(0.5, 0.5);
        _labelLose.tint = 0xff2600;
        
        var _star_1 = this.add.sprite(320.0, 240.0, 'blue_star');
        _star_1.name = 'star_1';
        _star_1.setOrigin(0.5, 0.5);
        _star_1.tint = 0x932092;
        
        var _star_2 = this.add.sprite(431.0, 272.0, 'blue_star');
        _star_2.name = 'star_2';
        _star_2.angle = 14.999999999999998;
        _star_2.setScale(0.7, 0.7);
        _star_2.setOrigin(0.5, 0.5);
        _star_2.tint = 0x932092;
        
        var _star_3 = this.add.sprite(209.0, 272.0, 'blue_star');
        _star_3.name = 'star_3';
        _star_3.angle = -14.999999999999998;
        _star_3.setScale(0.7, 0.7);
        _star_3.setOrigin(0.5, 0.5);
        _star_3.tint = 0x932092;
        
        
        
        // fields
        
        this.fLightBeam = _lightBeam;
        this.fTxtStage = _txtStage;
        this.fTxtPoint = _txtPoint;
        this.fLabelLose = _labelLose;
        this.fStar_1 = _star_1;
        this.fStar_2 = _star_2;
        this.fStar_3 = _star_3;
        this.animate();
        
    }
    //-----------------------------------------------------------------------------------------------------------
    animate () {
        this.fTxtStage.text = 'STAGE ' + this.game.registry.get('user_level');
        this.fTxtPoint.text = '0';
        
        this.time.addEvent({
            delay: 400,
            callback: this._doAnimate,
            callbackScope: this
        });
    }
    //-----------------------------------------------------------------------------------------------------------
    _doAnimate () {
        this.pointAnim = 0;

        this.tweens.add({
            targets: this.fLightBeam,
            angle: {value:360, duration:4000},
            loop: true
        });

        this.fLabelLose.setScale( 1.6 );
        this.tweens.add({
            targets: this.fLabelLose,
            scaleX:{value:1,duration:400, ease:'Back.easeIn'},
            scaleY:{value:1,duration:400, ease:'Back.easeIn'}
        });

        this.fStar_1.setScale( 0.1 );
        this.tweens.add({
            targets: this.fStar_1,
            scaleX:{value:1,duration:400, ease:'Back.easeIn'},
            scaleY:{value:1,duration:400, ease:'Back.easeIn'}
        });
        this.fStar_2.setScale( 0.1 );
        this.tweens.add({
            targets: this.fStar_2,
            scaleX:{value:0.7,duration:400, ease:'Back.easeIn'},
            scaleY:{value:0.7,duration:400, ease:'Back.easeIn'}
        });
        this.fStar_3.setScale( 0.1 );
        this.tweens.add({
            targets: this.fStar_3,
            scaleX:{value:0.7,duration:400, ease:'Back.easeIn'},
            scaleY:{value:0.7,duration:400, ease:'Back.easeIn'}
        });

        this.tweens.addCounter({
            from         : 0,
            to           : PointManager.Singleton().getTotalPoint(),
            duration     : 400,
            onUpdate     : this.updatePoint,
            onComplete   : this.finalizePoint,
            callbackScope: this
        });
        
        // this.add.tween( this.fLightBeam )
        //     .to({angle:360}, 4 * Phaser.Timer.SECOND )
        //     .loop()
        //     .start();
        // this.add.tween( this.fLabelLose.scale )
        //     .from({x:1.6, y:1.6}, 0.4 * Phaser.Timer.SECOND, Phaser.Easing.Back.In, true );
        // this.add.tween( this.fStar_1.scale )
        //     .from({x:0.1, y:0.1}, 0.4 * Phaser.Timer.SECOND, Phaser.Easing.Back.In, true );
        // this.add.tween( this.fStar_2.scale )
        //     .from({x:0.1, y:0.1}, 0.4 * Phaser.Timer.SECOND, Phaser.Easing.Back.In, true );
        // this.add.tween( this.fStar_3.scale )
        //     .from({x:0.1, y:0.1}, 0.4 * Phaser.Timer.SECOND, Phaser.Easing.Back.In, true );
        // this.add.tween( this )
        //     .to( { pointAnim: PointManager.Singleton.getTotalPoint() }, 0.4 * Phaser.Timer.SECOND )
        //     .onUpdateCallback( this.updatePoint, this )
        //     .start()
        //     .onComplete.add( this.finalizePoint, this );
    }
    //-----------------------------------------------------------------------------------------------------------
    updatePoint () {
        this.fTxtPoint.text = '' + Math.floor( this.pointAnim );
    }
    //-----------------------------------------------------------------------------------------------------------
    finalizePoint () {
        this.fTxtPoint.text = numberWithCommas( PointManager.Singleton().getTotalPoint() );
    }
    //-----------------------------------------------------------------------------------------------------------
    toNextLevel () {
        this.scene.transition( { target:'Home', duration:500 } );
    }
}

export default Lose;