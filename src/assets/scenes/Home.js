class Home extends Phaser.Scene {
    constructor () {
        super();
    }

    create () {
        var _btnStartBg = this.add.sprite( 320.0, 640.0, 'battle_ui', 'white' );
        _btnStartBg.name = 'btnStartBg';
        _btnStartBg.setScale( 20.0, 40.0 );
        _btnStartBg.alpha = 0.9;

        var _btnStartText = this.add.text(320.0, 640.0, 'START', {"font":"bold 48px DIN Alternate","fill":"#242fa5","align":"center"});
        _btnStartText.name = 'btnStartText';

        // PointManager.Singleton._reset();

        console.log( 'HOME' );
    }

    toBattleState () {
        this.game.data.userLevel = 1;
        this.scene.start( 'Battle' );
    }
}

export default Home;