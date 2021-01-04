import PowerBar from "../../prefabs/PowerBar";
import { GameEvents } from "./GameEvents";
import Battle from '../../scenes/Battle';
import { onlyUnique, clamp } from '../common/PhaserExtensions';

class BattleUI {
    constructor (battleScene) {
        /** @type Battle */this.scene = battleScene;
        //                     0, 1,  2,  3,  4,  5,  6,  7,  8
        this.spineByHit = [ 0, 25, 25, 25, 50, 50, 75, 75, 100 ];
        this.init();
    }
    //-------------------------------------------------------------------------------------------------------
    init () {
        /** @type Phaser.GameObjects.Sprite */this.spine     = this.scene.fSpine;
        /** @type Phaser.GameObjects.Sprite */this.redBottom = this.scene.fRed_bottom;
        /** @type PowerBar */this.powerBar  = this.scene.fPowerBar;
        /** @type Phaser.GameObjects.Text */this.txtTime   = this.scene.fTxt_time;
        /** @type Phaser.GameObjects.Text */this.txtPoint  = this.scene.fTxt_point;
        
        var spineFrames = this.spineByHit.filter( onlyUnique );
        for (var i = 0 ; i < spineFrames.length; ++i) {
            this.spine.anims.create({
                key: 'spine-' + spineFrames[i], 
                frames: [{key:'battle_ui', frame:'spine-' + spineFrames[i]}]
            });
        }
        
        this.connectWithTimer();
        this.connectWithPointManager( this.scene.pointManager );
        this.connectWithPowerManager( this.scene.powerManager );
        this.connectWithHitCount( this.scene );
        this.redBottom.alpha = 0;
    }
    //-------------------------------------------------------------------------------------------------------
    connectWithTimer () {
        this.scene.events.on( GameEvents.UPDATE_TIME, this.onUpdateTimer, this );
    }
    //-------------------------------------------------------------------------------------------------------
    connectWithPointManager (battlePointManager) {
        this.onUpdatePoint( battlePointManager.getTotalPoint() );
        this.scene.events.on( GameEvents.UPDATE_POINT, this.onUpdatePoint, this );
    }
    //-------------------------------------------------------------------------------------------------------
    connectWithPowerManager (battlePowerManager) {
        this.powerBar.set( battlePowerManager.getPoint() );
        this.scene.events.on( GameEvents.UPDATE_POWER, this.powerBar.set, this.powerBar );
        this.scene.events.on( GameEvents.ACTIVATE_POWER, this.powerBar.onActivate, this.powerBar );
    }
    //-------------------------------------------------------------------------------------------------------
    connectWithHitCount (battleScene) {
        this.setSpineByHit( battleScene.hitCount );
        this.scene.events.on( GameEvents.HIT, this.onUpdateHit, this );

        this.animFadeIn = this.scene.tweens.create({
            targets: this.redBottom,
            alpha: 1,
            duration: 300,
            ease: 'Cubic.easeOut'
        });
        this.animFadeOut = this.scene.tweens.create({
            targets: this.redBottom,
            alpha: 0,
            duration: 500,
            ease: 'Linear'
        });
    }
    //-------------------------------------------------------------------------------------------------------
    onUpdateTimer (t) {
        this.txtTime.text = '' + t;
        this.txtTime.fill = (t > 5) ? '#FFFFFF' : '#FF0000'; 
    }
    //-------------------------------------------------------------------------------------------------------
    onUpdatePoint (p) {
        this.txtPoint.text = '' + p; 
    }
    //-------------------------------------------------------------------------------------------------------
    setSpineByHit (hit) {
        hit = hit.clamp(0, this.spineByHit.length - 1);
        this.spine.play( 'spine-' + this.spineByHit[hit] );
    }
    //-------------------------------------------------------------------------------------------------------
    onUpdateHit (hit) {
        this.setSpineByHit( hit );
        
        // CANNOT re-use timeline ---> re-use sub-tweens
        if (this.hitTimeline && this.hitTimeline.isPlaying()) {
            this.hitTimeline.stop();
        }
        this.redBottom.alpha = 0;
        this.hitTimeline = this.scene.tweens.createTimeline()
            .queue( this.animFadeIn )
            .queue( this.animFadeOut );
        this.hitTimeline.play();
    }
}

export default BattleUI;