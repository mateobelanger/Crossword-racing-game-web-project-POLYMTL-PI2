import * as THREE from "three";
import { BACKGROUND_PLANE, BACKGROUND_PLANE_POSITION_Z, EDITOR_LAND_WIDTH, EDITOR_LAND_HEIGHT } from "../../constants";

const REPEAT_IMAGE_X: number = 10;
const REPEAT_IMAGE_Z: number = 8;
const BACKGROUND_PATH: string = "../../../../assets/track_editor_texture/cell_bg_3.jpg";

export class BackgroundPlane {

    private backgroundPlane: THREE.Mesh;

    public constructor(private scene: THREE.Scene) {
        this.backgroundPlane = null;
    }

    public getBackgroundPlane (): THREE.Mesh {
        return this.backgroundPlane;
    }

    public generateBackgroundPlane (): void {
        const material: THREE.MeshPhongMaterial = this.getBackgroundMaterial();
        this.backgroundPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(EDITOR_LAND_WIDTH, EDITOR_LAND_HEIGHT), material
        );
        this.backgroundPlane.position.z = BACKGROUND_PLANE_POSITION_Z;
        this.backgroundPlane.name = BACKGROUND_PLANE;
        this.scene.add(this.backgroundPlane);

    }

    private getBackgroundMaterial(): THREE.MeshPhongMaterial {
        const createTexture: THREE.Texture =
                         new THREE.TextureLoader().load(BACKGROUND_PATH);

        createTexture.wrapS = THREE.RepeatWrapping;
        createTexture.wrapT = THREE.RepeatWrapping;
        createTexture.repeat.set( REPEAT_IMAGE_X, REPEAT_IMAGE_Z);

        return new THREE.MeshPhongMaterial({ map: createTexture, side: THREE.DoubleSide});
    }

}
