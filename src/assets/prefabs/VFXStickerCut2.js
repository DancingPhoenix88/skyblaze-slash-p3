import BaseVFXStickerCut from "../scripts/prefabs/BaseVFXStickerCut";

class VFXStickerCut2 extends BaseVFXStickerCut {
    constructor (scene, x, y, children) {
        super(scene, x, y, children);

        var _lower = scene.add.sprite(118.0, -205.60800170898435, 'actors', 'cut-sticker-t2p2');
        this.add( _lower );
        _lower.name = 'lower';
        _lower.setOrigin(0.5, 0.42012833919967135);
        
        var _upper = scene.add.sprite(179.0, -475.9440002441406, 'actors', 'cut-sticker-t2p1');
        this.add( _upper );
        _upper.name = 'upper';
        _upper.setOrigin(0.5, 0.15214973218513256);
        
        var _slash = scene.add.sprite(146.0, -384.0, 'anim_slash_power', 'slash_frame_01.png');
        this.add( _slash );
        _slash.name = 'slash';
        _slash.angle = -2.5091692003720887;
        _slash.setOrigin(0.5, 0.5);
        
        
        
        // fields
        
        this.fLower = _lower;
        this.fUpper = _upper;
        this.fSlash = _slash;
    }
}

export default VFXStickerCut2;