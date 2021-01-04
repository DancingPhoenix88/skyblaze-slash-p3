class Sticker extends Phaser.GameObjects.Sprite {
    constructor (scene, x = 0, y = 0, texture = 'actors', frame = 'sticker') {
        super( scene, x, y, texture, frame );

        this.setOrigin( 0, 1 );
    }
}

export default Sticker;