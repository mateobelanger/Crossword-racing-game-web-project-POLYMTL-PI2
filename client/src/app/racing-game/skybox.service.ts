import { Injectable } from '@angular/core';
import { Scene, CubeTextureLoader} from "three";

const NUMBER_OF_SKYBOXES: number = 7;

@Injectable()
export class SkyboxService {

  private scene: Scene;
  private skyboxName: string;
  private skyboxSate: string;
  // TODO : string magique?
  private skyboxes: string[] = ["clouds", "interstellar", "moon", "ocean",
                                "sand", "storm", "sunset" ];

  public constructor() { }

  public initialization (scene: Scene): void {
    this.scene = scene;
    this.skyboxName = this.skyboxes[Math.floor(Math.random() * NUMBER_OF_SKYBOXES)];
    this.skyboxSate = "day";
  }

  public generateSkybox(): void {

    this.scene.background = new CubeTextureLoader()
    .setPath ( '../../../assets/skybox/' + this.skyboxName + '/' + this.skyboxSate + '/')
    .load ( [
        'right.png',
        'left.png',
        'top.png',
        'bottom.png',
        'back.png',
        'front.png'
    ] );

  }
}
