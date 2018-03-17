import { Injectable } from "@angular/core";
import * as THREE from "three";

const SKYBOXES: Array<string> = ["clouds", "interstellar", "moon", "ocean",
                                 "sand", "storm", "sunset"];


@Injectable()
export class SkyboxService {

    private scene: THREE.Scene;
    public skyboxName: string;
    public skyboxSate: string;


    public constructor() {
        this.scene = null;
        this.skyboxName = "";
        this.skyboxSate = "";
    }

    public initialize(scene: THREE.Scene): void {
      this.scene = scene;
      this.skyboxName = SKYBOXES[Math.floor(Math.random() * SKYBOXES.length)];
      this.skyboxSate = "day";
    }

    public generateSkybox(): void {
      this.scene.background = new THREE.CubeTextureLoader()
        .setPath("../../../assets/skybox/" + this.skyboxName + "/" + this.skyboxSate + "/")
        .load([
          "right.png",
          "left.png",
          "top.png",
          "bottom.png",
          "back.png",
          "front.png"
        ]);
    }

}
