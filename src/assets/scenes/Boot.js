import Home from "./Home";

class Boot extends Phaser.Scene {
    constructor () {
        super();
    }

    preload () {
        this.load.pack( 'pack', './src/assets/pack.json', 'battle' );
    }
      
    create () {
        this.scene.add( 'Home', Home );


        this.scene.start( 'Home' );
    }
}

export default Boot;