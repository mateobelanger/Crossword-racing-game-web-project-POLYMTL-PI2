import { Injectable } from '@angular/core';
import { Scene, CubeTextureLoader} from "three";

@Injectable()
export class SkyboxService {

  private scene: Scene;
  private skyboxName: string;

  constructor() { }

  public initialization (scene: Scene): void {
    this.scene = scene;
    this.skyboxName = "interstellar";
  }



  public generateSkybox(): void {

    /*skyboxName: string
    if (skyboxName) {
      this.skyboxName = skyboxName;
    }*/

    this.scene.background = new CubeTextureLoader()
    .setPath ( '../../../assets/skybox/sand/' ) //.setPath ( '../../../assets/skybox/' + this.skyboxName + '/' )
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
