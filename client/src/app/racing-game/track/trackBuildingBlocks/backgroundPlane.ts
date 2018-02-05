import * as THREE from "three";

const BACKGROUND_PLANE_POSITION_Z: number = -3;

export class BackgroundPlane {

    private backgroundPlane: THREE.Mesh;

    public constructor(private scene: THREE.Scene, private container: HTMLDivElement) {
        this.backgroundPlane = null;
    }

    public getBackgroundPlane (): THREE.Mesh {
        return this.backgroundPlane;
    }

    public generateBackgroundPlan (): void {
        const material: THREE.MeshBasicMaterial = this.getBackgroundMaterial();
        this.backgroundPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(this.container.clientWidth, this.container.clientHeight), material
        );
        this.backgroundPlane.position.z = BACKGROUND_PLANE_POSITION_Z;
        this.backgroundPlane.name = "backgroundPlane";
        this.scene.add(this.backgroundPlane);

    }

    private getBackgroundMaterial(): THREE.MeshBasicMaterial {
        let createTexture: THREE.Texture = new THREE.Texture;
        createTexture = new THREE.TextureLoader().load("../../../../assets/road/background_gif_texture_.gif");

        createTexture.wrapS = THREE.RepeatWrapping;
        createTexture.wrapT = THREE.RepeatWrapping;
        createTexture.repeat.set( 2, 2);

        return new THREE.MeshBasicMaterial({ map: createTexture, side: THREE.DoubleSide});
    }

}
