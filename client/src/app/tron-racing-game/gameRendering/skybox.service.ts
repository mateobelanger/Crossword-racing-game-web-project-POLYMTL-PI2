import { Injectable } from "@angular/core";
import * as THREE from "three";
import { LAND_WIDTH, LAND_HEIGHT, BACKGROUND_PLANE_POSITION_Y } from "../constants";

const SKYBOXES: Array<string> = ["clouds", "interstellar", "moon", "ocean",
                                 "sand", "storm", "sunset", "tron", "totality"];

const SCENE_STATE_DAY: string = "day";
const SCENE_STATE_NIGHT: string = "night";

const REPEAT_IMAGE_X: number = 250;
const REPEAT_IMAGE_Z: number = 200;

@Injectable()
export class SkyboxService {

    private scene: THREE.Scene;
    public skyboxName: string;
    public sceneState: string;
    private backgroundPlane: THREE.Mesh;

    private daySkybox: THREE.CubeTexture;
    private nightSkybox: THREE.CubeTexture;

    public constructor() {
        this.scene = null;
        this.skyboxName = "";
        this.sceneState = "";
        this.backgroundPlane = null;
    }

    public initialize(scene: THREE.Scene): void {
      this.scene = scene;
      this.skyboxName = SKYBOXES[4 /*Math.floor(Math.random() * SKYBOXES.length)*/];

      this.sceneState = SCENE_STATE_DAY;

      this.daySkybox = this.generateDaySkybox();
      this.nightSkybox = this.generateNightSkybox();
      this.scene.background = this.daySkybox;

      this.generateBackgroundView();
    }

    public updateScene(): void {
        this.changeSceneState();
        this.changeSceneSkybox();
    }

    private changeSceneState(): void {
        this.sceneState = this.sceneState === SCENE_STATE_DAY ? SCENE_STATE_NIGHT : SCENE_STATE_DAY;
    }

    private changeSceneSkybox(): void {
        this.scene.background = this.sceneState === SCENE_STATE_DAY ? this.daySkybox : this.nightSkybox;
    }

    private generateDaySkybox(): THREE.CubeTexture {
        return this.generateSkybox(SCENE_STATE_DAY);
    }

    private generateNightSkybox(): THREE.CubeTexture {
        return this.generateSkybox(SCENE_STATE_NIGHT);
    }

    private generateSkybox(sceneState: string): THREE.CubeTexture {
      return new THREE.CubeTextureLoader()
                 .setPath("../../../assets/skybox/" + this.skyboxName + "/" + sceneState + "/")
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


