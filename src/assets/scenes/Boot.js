import Home from "./Home";
import Battle from "./Battle";

class Boot extends Phaser.Scene {
    constructor () {
        super();
    }

    preload () {
        this.load.pack( 'pack', './src/assets/pack.json', 'battle' );
    }
      
    create () {
        this.scene.add( 'Home', Home );
        this.scene.add( 'Battle', Battle );

        this.scene.transition( { target:'Home', duration:500 } );
    }
}

export default Boot;