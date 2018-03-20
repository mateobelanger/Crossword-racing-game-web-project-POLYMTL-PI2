import * as THREE from "three";
import { BACKGROUND_PLANE, BACKGROUND_PLANE_POSITION_Z, EDITOR_LAND_WIDTH, EDITOR_LAND_HEIGHT } from "../../constants";


const REAPEAT_IMAGE: number = 2;

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
                         new THREE.TextureLoader().load("../../../../assets/track_editor_texture/background_texture.png");

        createTexture.wrapS = THREE.RepeatWrapping;
        createTexture.wrapT = THREE.RepeatWrapping;
        createTexture.repeat.set( REAPEAT_IMAGE, REAPEAT_IMAGE);

        return new THREE.MeshPhongMaterial({ map: createTexture, side: THREE.DoubleSide});
    }

}
