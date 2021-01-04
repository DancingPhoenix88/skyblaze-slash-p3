import BaseVFXStickerCut from "../scripts/prefabs/BaseVFXStickerCut";

class VFXStickerCut1 extends BaseVFXStickerCut {
    constructor (scene, x, y, children) {
        super(scene, x, y, children);

        var _lower = scene.add.sprite(118.49999999999999, -145.86, 'actors', 'cut-sticker-t1p2');
        this.add( _lower );
        _lower.name = 'lower';
        _lower.setOrigin(0.5, 0.24);
        
        var _upper = scene.add.sprite(178.5, -392.70000000000005, 'actors', 'cut-sticker-t1p1');
        this.add( _upper );
        _upper.name = 'upper';
        _upper.setOrigin(0.5, 0.3);
        
        var _slash = scene.add.sprite(130.0, -230.0, 'anim_slash_power', 'slash_frame_01.png');
        this.add( _slash );
        _slash.name = 'slash';
        _slash.angle = 26.285755904956723;
        _slash.setOrigin(0.5, 0.5);
        
        
        
        // fields
        
        this.fLower = _lower;
        this.fUpper = _upper;
        this.fSlash = _slash;
    }
}

export default VFXStickerCut1;