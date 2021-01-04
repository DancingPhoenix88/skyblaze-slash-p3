import { BaseActor } from "../scripts/prefabs/BaseActor";

export class Item extends Phaser.GameObjects.Sprite {
    constructor (scene, x = 0, y = 0, texture = 'actors', frame = 'item-a') {
        super( scene, x, y, texture, frame );

        this.setOrigin( 0, 1 );

        this.anims.create({ key: 'item-a', frames:[ {key:'actors',frame:'item-a'} ] });
        this.anims.create({ key: 'item-b', frames:[ {key:'actors',frame:'item-b'} ] });
        this.anims.create({ key: 'item-c', frames:[ {key:'actors',frame:'item-c'} ] });
        this.anims.create({ key: 'item-d', frames:[ {key:'actors',frame:'item-d'} ] });
        this.anims.create({ key: 'item-e', frames:[ {key:'actors',frame:'item-e'} ] });
    }

    setType (type) {
        type = Math.floor( type.clamp(1,5) );
    
        /** @type BaseActor */var actor = this.data.get('stats');
        actor._type = type;
        actor._point = ItemPointMap[ type ];
        
        this.play( 'item-' + ItemSpriteMap[ type ] );
    }
}
export const ItemPointMap =     [0,     1,         2,         2,         3,         3  ];
export const ItemSpriteMap = ['',     'a',     'b',     'c',     'd',     'e'];

export default Item;