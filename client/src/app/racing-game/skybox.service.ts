import { Injectable } from "@angular/core";
import * as THREE from "three";
import { LAND_WIDTH, LAND_HEIGHT, BACKGROUND_PLANE_POSITION_Y } from "./constants";

const SKYBOXES: Array<string> = ["clouds", "interstellar", "moon", "ocean",
                                 "sand", "storm", "sunset", "tron"];

const SCENE_STATE: Array<string> = ["day", "night"];

const REPEAT_IMAGE_X: number = 500;
const REPEAT_IMAGE_Z: number = 400;

@Injectable()
export class SkyboxService {

    private scene: THREE.Scene;
    public skyboxName: string;
    public sceneState: string;
    private backgroundPlane: THREE.Mesh;

    public constructor() {
        this.scene = null;
        this.skyboxName = "";
        this.sceneState = "";
        this.backgroundPlane = null;
    }

    public initialize(scene: THREE.Scene): void {
      this.scene = scene;
      this.skyboxName = SKYBOXES[4 /*Math.floor(Math.random() * SKYBOXES.length)*/];

      this.sceneState = SCENE_STATE[0];
      this.generateSkybox();
      this.generateBackgroundView();
    }

    public changeSceneState(): void {
        this.sceneState = this.sceneState === SCENE_STATE[0] ? SCENE_STATE[1] : SCENE_STATE[0];
        this.generateSkybox();
    }

    private generateSkybox(): void {
      this.scene.background = new THREE.CubeTextureLoader()
        .setPath("../../../assets/skybox/" + this.skyboxName + "/" + this.sceneState + "/")
        .load([
          "right.png",
          "left.png",
          "top.png",
          "bottom.png",
          "back.png",
          "front.png"
        ]);
    }

    private generateBackgroundView(): void {
        const texture: THREE.Texture = new THREE.TextureLoader().load("../../../assets/skybox/cell_bg.png");

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(REPEAT_IMAGE_X, REPEAT_IMAGE_Z);

        const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
        this.backgroundPlane = new THREE.Mesh(new THREE.PlaneGeometry(LAND_WIDTH, LAND_HEIGHT), material);
        this.backgroundPlane.position.y = BACKGROUND_PLANE_POSITION_Y;

        const axis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
        this.backgroundPlane.rotateOnAxis(axis, Math.PI / 2);
        this.backgroundPlane.receiveShadow = true;

        this.scene.add(this.backgroundPlane);
    }
}


