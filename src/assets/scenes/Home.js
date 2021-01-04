import VFXStickerCut1 from "../prefabs/VFXStickerCut1";
import PointManager from "../scripts/game/PointManager";
import { ActorType, BaseActor } from "../scripts/prefabs/BaseActor";

class Home extends Phaser.Scene {
    constructor () {
        super();
    }

    create () {
        var _btnStartBg = this.add.sprite( 320.0, 640.0, 'battle_ui', 'white' );
        _btnStartBg.name = 'btnStartBg';
        _btnStartBg.setOrigin( 0.5, 0.5 );
        _btnStartBg.setScale( 20.0, 4.0 );
        _btnStartBg.setInteractive({ useHandCursor: true })
            .on( 'pointerdown', this.toBattleState, this );

        var _btnStartText = this.add.text(320.0, 640.0, 'START', {font:"48px DIN Alternate",fill:"#242fa5",align:"center"});
        _btnStartText.name = 'btnStartText';
        _btnStartText.setOrigin( 0.5, 0.5 );

        PointManager.Singleton()._reset();
    }

    toBattleState () {
        this.game.registry.set( 'user_level', 1 );
        this.scene.transition( { target:'Battle', duration:500 } );

    }
}

export default Home;