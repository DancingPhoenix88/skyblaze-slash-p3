import PowerManager from "../scripts/game/PowerManager";

class PowerBar extends Phaser.GameObjects.Container {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);
        
        /** @type Phaser.GameObjects.Sprite */var _barPower = scene.add.sprite(47.0, 0.0, 'battle_ui', 'power-bar-low');
        this.add( _barPower );
        _barPower.name = 'barPower';
        _barPower.setOrigin(0.0, 0.5);
        _barPower.anims.create({key:'low', frames:[{key:'battle_ui',frame:'power-bar-low'}]});
        _barPower.anims.create({key:'normal', frames:[{key:'battle_ui',frame:'power-bar-normal'}]});
        _barPower.anims.create({key:'full', frames:[{key:'battle_ui',frame:'power-bar-full'}]});
        
        /** @type Phaser.GameObjects.Sprite */var _iconPower = scene.add.sprite(0.0, 0.0, 'battle_ui', 'icon-power-normal');
        this.add( _iconPower );
        _iconPower.name = 'iconPower';
        _iconPower.setOrigin(0.0, 0.5);
        _iconPower.anims.create({key:'normal', frames:[{key:'battle_ui',frame:'icon-power-normal'}]});
        _iconPower.anims.create({key:'full', frames:[{key:'battle_ui',frame:'icon-power-full'}]});
        
        /** @type Phaser.GameObjects.Sprite */var _iconRing = scene.add.sprite(31.000000000000004, 0.0, 'battle_ui', 'power-bar-drain-rotate');
        this.add( _iconRing );
        _iconRing.name = 'iconRing';
        _iconRing.setOrigin(0.5, 0.4719797616981598);
        
        /** @type Phaser.GameObjects.Sprite */var _fxNewFull = scene.add.sprite(29.0, 0.0, 'anim_slash_power', 'full_power_frame_01.png');
        this.add( _fxNewFull );
        _fxNewFull.name = 'fxNewFull';
        _fxNewFull.setOrigin(0.5, 0.5);
        _fxNewFull.anims.create({key:'idle', frames:[{key:'anim_slash_power',frame:'empty'}]});
        _fxNewFull.anims.create({key:'active', frames:[{key:'anim_slash_power',frame:'full_power_frame_01.png'}, {key:'anim_slash_power',frame:'full_power_frame_02.png'}, {key:'anim_slash_power',frame:'full_power_frame_03.png'}, {key:'anim_slash_power',frame:'full_power_frame_04.png'}, {key:'anim_slash_power',frame:'full_power_frame_05.png'}, {key:'anim_slash_power',frame:'full_power_frame_06.png'}, {key:'anim_slash_power',frame:'full_power_frame_07.png'}, {key:'anim_slash_power',frame:'full_power_frame_08.png'}, {key:'anim_slash_power',frame:'full_power_frame_09.png'}, {key:'anim_slash_power',frame:'full_power_frame_10.png'}, {key:'anim_slash_power',frame:'full_power_frame_11.png'}, {key:'anim_slash_power',frame:'full_power_frame_12.png'}, {key:'anim_slash_power',frame:'full_power_frame_13.png'}, {key:'anim_slash_power',frame:'full_power_frame_14.png'}, {key:'anim_slash_power',frame:'full_power_frame_15.png'}, {key:'anim_slash_power',frame:'full_power_frame_16.png'}]});

        this.fBarPower = _barPower;
        this.fIconPower = _iconPower;
        this.fIconRing = _iconRing;
        this.fFxNewFull = _fxNewFull;

        scene.add.existing(this);

        this.init();
    }
    //-------------------------------------------------------------------------------------------------------
    init () {
        this.fBarPower.play('low');
        this.fIconPower.play('normal');
        this.fFxNewFull.play('idle');
        this.maxPowerBarWidth = this.fBarPower.width;
        this.powerBarCrop = new Phaser.Geom.Rectangle( 0, 0, this.maxPowerBarWidth, this.fBarPower.height );
        this.fBarPower.setCrop( this.powerBarCrop );
        this.fIconRing.setVisible( false );
    }
    //-------------------------------------------------------------------------------------------------------
    set (point) {
        var progress = (point / PowerManager.Singleton().getMaxPoint()).clamp(0,1);
    //    console.log( 'set power bar = ', point, ' ~ ', progress * 100, '%' );
        
        if (progress < 0.4) {
            this.fBarPower.play( 'low' );
            this.fIconPower.play( 'normal' );
            this.fFxNewFull.play( 'idle' );
        } else if (progress < 0.99) {
            this.fBarPower.play( 'normal' );
            this.fIconPower.play( 'normal' );
            this.fFxNewFull.play( 'idle' );
        } else { // FULL
            this.fBarPower.play( 'full' );
            this.fIconPower.play( 'full' );
            this.fFxNewFull.play( 'active' );
        }
        this.powerBarCrop.width = progress * this.maxPowerBarWidth;
        this.fBarPower.setCrop( this.powerBarCrop );
    }
    //-------------------------------------------------------------------------------------------------------
    onActivate (multiplier, duration) {
        this.fIconRing.setVisible( true );
        this.tweenRing = this.scene.tweens.add({
            targets: this.fIconRing,
            angle: {value:360, duration:600},
            loop: true
        });
        this.tweenBar = this.scene.tweens.add( {
            targets: this.powerBarCrop,
            width: {value:0, duration:duration},
            onUpdate: this._onTweenBar,
            callbackScope: this
        });

        this.scene.time.addEvent({
            delay: duration,
            callback: this._onActivateEnd,
            callbackScope: this
        });
    }
    //-------------------------------------------------------------------------------------------------------
    _onActivateEnd () {
        this.fIconRing.setVisible( false );
        this.tweenRing.stop();
    }
    //-------------------------------------------------------------------------------------------------------
    _onTweenBar () {
        this.fBarPower.setCrop( this.powerBarCrop );
    }
}

export default PowerBar;