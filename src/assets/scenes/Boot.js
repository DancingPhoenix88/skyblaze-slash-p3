import Home from "./Home";
import Battle from "./Battle";
import Win from "./Win";
import Lose from "./Lose";

class Boot extends Phaser.Scene {
    constructor () {
        super();
    }

    preload () {
        this.load.pack( 'pack_battle', './src/assets/pack_battle.json', 'battle' );
    }
      
    create () {
        this.scene.add( 'Home',     Home );
        this.scene.add( 'Battle',   Battle );
        this.scene.add( 'Win',      Win );
        this.scene.add( 'Lose',     Lose );

        this.scene.transition( { target:'Home', duration:500 } );
    }
}

export default Boot;