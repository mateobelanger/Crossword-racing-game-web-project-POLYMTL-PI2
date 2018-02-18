import { Injectable } from '@angular/core';
import * as THREE from "three";
import { LAND_WIDTH, LAND_HEIGHT, BACKGROUND_PLANE_POSITION_Y } from './constants';

const NUMBER_OF_SKYBOXES: number = 7;

@Injectable()
export class SkyboxService {

    private scene: THREE.Scene;
    private skyboxName: string;
    private skyboxSate: string;
    private backgroundPlane: THREE.Mesh;

    // TODO : string magique?
    private skyboxes: string[] = ["clouds", "interstellar", "moon", "ocean",
                                  "sand", "storm", "sunset"];

    public constructor() { }

    public initialization(scene: THREE.Scene): void {
      this.scene = scene;
      this.skyboxName = this.skyboxes[Math.floor(Math.random() * NUMBER_OF_SKYBOXES)]; //
      this.skyboxSate = "day";
      this.generateBackgroundView();
    }

    public generateSkybox(): void {

      this.scene.background = new THREE.CubeTextureLoader()
        .setPath('../../../assets/skybox/' + this.skyboxName + '/' + this.skyboxSate + '/')
        .load([
          'right.png',
          'left.png',
          'top.png',
          'bottom.png',
          'back.png',
          'front.png'
        ]);

    }

    public generateBackgroundView(): void {
      let texture: THREE.Texture;
      texture = new THREE.TextureLoader().load('../../../assets/skybox/' + this.skyboxName + '/' + this.skyboxSate + '/bottom.png');
      const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      this.backgroundPlane = new THREE.Mesh(new THREE.PlaneGeometry(LAND_WIDTH, LAND_HEIGHT), material);
      this.backgroundPlane.position.y = BACKGROUND_PLANE_POSITION_Y;

      const axis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
      // tslint:disable-next-line:no-magic-numbers
      this.backgroundPlane.rotateOnAxis(axis, Math.PI / 2);

      this.scene.add(this.backgroundPlane);
    }

}
