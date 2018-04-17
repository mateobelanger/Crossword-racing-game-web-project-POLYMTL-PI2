import { Injectable } from '@angular/core';
import { Object3D, ObjectLoader } from 'three';
import { CAR_TEXTURE } from "../../constants";

const CAR_TEXTURE_FOLDER: string = "../../../../assets/camero/";

@Injectable()
export class TextureLoaderService {

    public constructor() { }



    public loadCarTexture(carColor: CAR_TEXTURE): Promise<Object3D> {
        return this.load(this.carTextureName(carColor));
    }

    private carTextureName( carColor: CAR_TEXTURE): string {
        switch (carColor) {
            case CAR_TEXTURE.DARK_BLUE:
                return "camero-2010-low-poly-db.json";
            case CAR_TEXTURE.LIGHT_BLUE:
                return "camero-2010-low-poly-lb.json";
            case CAR_TEXTURE.GREEN:
                return "camero-2010-low-poly-g.json";
            case CAR_TEXTURE.RED:
                return "camero-2010-low-poly-r.json";
            case CAR_TEXTURE.YELLOW:
                return "camero-2010-low-poly-y.json";
            default:
                return "camero-2010-low-poly-lb.json";
        }
    }

    private load( textureName: string ): Promise<Object3D> {
        return new Promise<Object3D>((resolve, reject) => {
            const loader: ObjectLoader = new ObjectLoader();
            loader.load( CAR_TEXTURE_FOLDER + textureName, (object) => {
                resolve(object);
            });
        });
    }
}
