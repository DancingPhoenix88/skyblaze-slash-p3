import BaseVFXStickerCut from "../scripts/prefabs/BaseVFXStickerCut";

class VFXStickerCut3 extends BaseVFXStickerCut {
    constructor (scene, x, y, children) {
        super(scene, x, y, children);

        var _lower = scene.add.sprite(118.0, -85.59999847412108, 'actors', 'cut-sticker-t3p2');
        this.add( _lower );
        _lower.name = 'lower';
        _lower.setOrigin(0.5, 0.1480213930942583);
        
        var _upper = scene.add.sprite(179.0, -328.1999816894531, 'actors', 'cut-sticker-t3p1');
        this.add( _upper );
        _upper.name = 'upper';
        _upper.setOrigin(0.5, 0.4155080540294953);
        
        var _slash = scene.add.sprite(154.0, -112.0, 'anim_slash_power', 'slash_frame_01.png');
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

export default VFXStickerCut3;