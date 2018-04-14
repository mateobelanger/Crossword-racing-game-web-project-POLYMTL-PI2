import { Injectable } from "@angular/core";
import * as THREE from "three";

const SKYBOXES_PATH: string = "../../../assets/skybox/";
const SKYBOX_NAME: string = "tron";

const RIGHT_IMAGE: string = "right.png";
const LEFT_IMAGE: string = "left.png";
const TOP_IMAGE: string = "top.png";
const BOTTOM_IMAGE: string = "bottom.png";
const BACK_IMAGE: string = "back.png";
const FRONT_IMAGE: string = "front.png";

const SCENE_STATE_DAY: string = "day";
const SCENE_STATE_NIGHT: string = "night";

@Injectable()
export class SkyboxService {

    private scene: THREE.Scene;
    public skyboxName: string;
    public sceneState: string;


    private daySkybox: THREE.CubeTexture;
    private nightSkybox: THREE.CubeTexture;

    public constructor() {
        this.scene = null;
        this.skyboxName = "";
        this.sceneState = "";
    }

    public initialize(scene: THREE.Scene): void {
      this.scene = scene;
      this.skyboxName = SKYBOX_NAME;

      this.sceneState = SCENE_STATE_DAY;

      this.daySkybox = this.generateDaySkybox();
      this.nightSkybox = this.generateNightSkybox();
      this.scene.background = this.daySkybox;
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
                 .setPath(SKYBOXES_PATH + this.skyboxName + "/" + sceneState + "/")
                 .load([
                   RIGHT_IMAGE,
                   LEFT_IMAGE,
                   TOP_IMAGE,
                   BOTTOM_IMAGE,
                   BACK_IMAGE,
                   FRONT_IMAGE
                 ]);
    }
}


