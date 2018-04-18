import { Injectable } from "@angular/core";
import * as THREE from "three";
import { LAND_WIDTH, LAND_HEIGHT } from "../constants";

export const LAND_TEXTURE: string = "../../../assets/skybox/cell_bg.png";

const LAND_POSITION_Y: number = -0.02;

const REPEAT_IMAGE_X: number = 250;
const REPEAT_IMAGE_Z: number = 200;

@Injectable()
export class LandService {

    private landPlane: THREE.Mesh;
    private scene: THREE.Scene;

    public constructor() {
        this.landPlane = null;
    }

    public initialize(scene: THREE.Scene): void {
        this.scene = scene;
        this.generateLand();
    }

    private generateLand(): void {
        const texture: THREE.Texture = new THREE.TextureLoader().load(LAND_TEXTURE);

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(REPEAT_IMAGE_X, REPEAT_IMAGE_Z);

        const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
        this.landPlane = new THREE.Mesh(new THREE.PlaneGeometry(LAND_WIDTH, LAND_HEIGHT), material);
        this.landPlane.position.y = LAND_POSITION_Y;

        const axis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
        this.landPlane.rotateOnAxis(axis, Math.PI / 2);
        this.landPlane.receiveShadow = true;

        this.scene.add(this.landPlane);
    }
}
