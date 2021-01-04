import PowerBar from '../prefabs/PowerBar';
import MasterData from '../scripts/common/MasterData';
import BattleLoopMove from '../scripts/game/BattleLoopMove';
import BattleLoopSpawn from '../scripts/game/BattleLoopSpawn';
import PointManager from '../scripts/game/PointManager';
import { GameEvents } from '../scripts/game/GameEvents';
import BattleTimer from '../scripts/game/BattleTimer';
import BattleUI from '../scripts/game/BattleUI';
import PowerManager from '../scripts/game/PowerManager';
import BattleActorPickVFX from '../scripts/game/BattleActorPickVFX';
import { randomRange } from '../scripts/common/PhaserExtensions';

const BattlePhase = Object.freeze({
    PREPARING : 0,
    PLAYING   : 1,
    WIN       : 2,
    TIME_OUT  : 3,
    LOSE      : 4,
    PAUSING   : 5
});

class Battle extends Phaser.Scene {
    constructor () {
        super();

        this.MAX_HIT_COUNT = 8;
        this.phase = BattlePhase.PREPARING;
        this.hitCount = 0;
    }

    create () {
        var _bgContainer = this.add.container();
        _bgContainer.name = 'bgGroup';

        var _bg = this.add.sprite(320.0, 568.0, 'battle_ui', 'white');
        _bgContainer.add( _bg );
        _bg.name = 'bg';
        _bg.setScale(50.0, 50.0);
        _bg.setOrigin(0.5, 0.5);
        _bg.tint = 0x3bccf7;
        
        var _goalLine = this.add.sprite(320.0, 1170.0, 'progress-bar', null);
        _bgContainer.add( _goalLine );
        _goalLine.name = 'goalLine';
        _goalLine.setScale(20.0, 1.0);
        _goalLine.setVisible( false );
        _goalLine.setOrigin(0.5, 0.5);
        _goalLine.tint = 0xff00df;
        
        var _spine = this.add.sprite(292.0, 59.0, 'battle_ui', 'spine-0');
        _bgContainer.add( _spine );
        _spine.name = 'spine';
        _spine.setOrigin(0.5, 0.0);
        
        var _actorContainer = this.add.container();
        _actorContainer.name = 'actorGroup';
        
        var _vfxContainer = this.add.container();
        _vfxContainer.name = 'vfxGroup';
        
        var _uiContainer = this.add.container();
        _uiContainer.name = 'uiGroup';
        
        var _red_bottom = this.add.sprite(320.0, 1136.0, 'battle_ui', 'red-bottom');
        _uiContainer.add( _red_bottom );
        _red_bottom.name = 'red_bottom';
        _red_bottom.setScale(120.0, 1.0);
        _red_bottom.setOrigin(0.5, 0.8);
        
        var _ui_bar = this.add.sprite(0.0, 0.0, 'battle_ui', 'ui-bar');
        _uiContainer.add( _ui_bar );
        _ui_bar.name = 'ui_bar';
        _ui_bar.setOrigin(0, 0);
        
        var _clock = this.add.sprite(320.0, 13.0, 'battle_ui', 'clock');
        _uiContainer.add( _clock );
        _clock.name = 'clock';
        _clock.setOrigin(0.5, 0.0);
        
        var _powerBar = new PowerBar( this );
        _uiContainer.add( _powerBar );
        _powerBar.setPosition(414.0, 58.0);
        
        var _icon_point = this.add.sprite(35.0, 26.0, 'battle_ui', 'icon-point');
        _uiContainer.add( _icon_point );
        _icon_point.name = 'icon_point';
        _icon_point.setOrigin(0, 0);
        
        var _txt_time = this.add.text(320.0, 30.0, '45', {"font":"48px DIN Alternate","fill":"#ffffff","align":"center"});
        _uiContainer.add( _txt_time );
        _txt_time.name = 'txt_time';
        _txt_time.setOrigin(0.5, 0.0);
        
        var _txt_point = this.add.text(93.0, 45.0, '5490', {"font":"20px DIN Alternate","fill":"#1a2e50"});
        _uiContainer.add( _txt_point );
        _txt_point.name = 'txt_point';
        _txt_point.setOrigin(0, 0);
        
        // fields
        
        this.fGoalLine = _goalLine;
        this.fSpine = _spine;
        this.fActorGroup = _actorContainer;
        this.fVfxGroup = _vfxContainer;
        this.fRed_bottom = _red_bottom;
        this.fPowerBar = _powerBar;
        this.fTxt_time = _txt_time;
        this.fTxt_point = _txt_point;

        this.initStage();
    }
    //-----------------------------------------------------------------------------------------------------------
    initStage () {
        this.phase = BattlePhase.PREPARING;

        // Init data
        var userLevel = this.game.registry.get( 'user_level' );
        var levelData = MasterData.Singleton.getById( 'stage', userLevel );
        this.game.registry.set( 'level', levelData );
        this.hitCount = 0;

        // Init controllers
        this.loopSpawn = new BattleLoopSpawn( this, this.fActorGroup );
        this.loopMove = new BattleLoopMove( this, this.fGoalLine.y );
        this.vfxActorPick = new BattleActorPickVFX( this, this.fActorGroup, this.fVfxGroup );
        this.pointManager = PointManager.Singleton( this.events );
        this.powerManager = PowerManager.Singleton( this.time, this.events );
        this.timer = new BattleTimer( this.time, this.events );
        this.allObjectsNeedUpdating = this.fActorGroup.getAll().concat( this.fVfxGroup.getAll() );
        
        // // Init events
        this.pointManager.clearEvents(); // because it is Singleton -> there might be Battle instnce subscribed to it already
        this.powerManager.clearEvents(); // because it is Singleton -> there might be Battle instnce subscribed to it already
        this.powerManager._reset();
        this.events.on( GameEvents.SPAWN, this.onSpawn, this );
        this.events.on( GameEvents.MISS, this.onMiss, this );
        this.events.on( GameEvents.PICK, this.onPick, this );
        this.events.on( GameEvents.TIME_OUT, this.onTimeOut, this );
    
        // Init UI
        this.ui = new BattleUI( this );
        
        // Start
        this.timer.start();
        this.phase = BattlePhase.PLAYING;
    }
    //-----------------------------------------------------------------------------------------------------------
    update (now, deltaTime) { // Auto-called by Phaser.Scene
        if (this.phase == BattlePhase.PLAYING) {
            this.time.update(now, deltaTime);       // Update Phaser clock ???
            this.tweens.update(now, deltaTime);     // Update Phaser tween ???

            // HACK: Update each object manually. What the FUCK, Phaser 3 ??????????
            for(var i = 0; i < this.allObjectsNeedUpdating.length; ++i) 
                if (this.allObjectsNeedUpdating[i].active) this.allObjectsNeedUpdating[i].update(now, deltaTime);

            this.loopSpawn.update(now, deltaTime);  // Spawn new actors
            this.loopMove.update(now, deltaTime);   // Move actors
            this.loopMove.postUpdate();             // Check if actors reaching goal
            
            this.fActorGroup.sort();                // Ensure sprites are rendered with correct order
        }
    }
    //-----------------------------------------------------------------------------------------------------------
    onSpawn (actorWrapper) {
        // console.log( 'on spawn event', actorWrapper );
        this.loopMove.add( actorWrapper );
    }
    //-----------------------------------------------------------------------------------------------------------
    onMiss (actorWrapper) {
        // console.log( 'on miss event', actorWrapper );
        /** @type BaseActor */var actor = actorWrapper.data.get('stats');
        actor.onMiss(); // It will be removed from LoopMove in the next 'update'
        this.loopSpawn.returnToPool( actorWrapper );
        
        if (actor.isSticker() == false) return;
        
        ++this.hitCount;
        this.events.emit( GameEvents.HIT, this.hitCount );
        
        if (this.hitCount >= this.MAX_HIT_COUNT) {
            this.onLose();
        }
    }
    //-----------------------------------------------------------------------------------------------------------
    onTimeOut () {
        console.log( 'on time out' );
        this.phase = BattlePhase.TIME_OUT;
        
        this.scene.transition( { target:'Win', duration:500 } );
    }
    //-----------------------------------------------------------------------------------------------------------
    onPick (actorWrapper, hitSegment, hitPosition) {
        // console.log( 'on pick', actorWrapper );
        
        /** @type BaseActor */var actor = actorWrapper.data.get('stats');
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
                        .animateFor( actorWrapper, p, 0.1 * i * 1000 );
                }
            }
        } else {
            this.powerManager.addPoint( point );
            this.vfxActorPick
                .getItemPickVFX()
                .animateFor( actorWrapper );
        }
        
        this.loopSpawn.returnToPool( actorWrapper );
    }
    //-----------------------------------------------------------------------------------------------------------
    onLose () {
        console.log( 'LOSE' );
        this.phase = BattlePhase.LOSE;
        
        this.scene.transition( { target:'Lose', duration:500 } );
    }
}

export default Battle;