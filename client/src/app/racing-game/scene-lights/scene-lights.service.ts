import { Injectable } from '@angular/core';
import * as THREE from "three";
import { EDITOR_LAND_HEIGHT, EDITOR_LAND_WIDTH } from '../constants';

const EDITOR_LAND_DIVISOR: number = 4;
const middlePointX: number = EDITOR_LAND_WIDTH / EDITOR_LAND_DIVISOR ;
const middlePointZ: number = EDITOR_LAND_HEIGHT / EDITOR_LAND_DIVISOR ;

const POINT_LIGHT_POSITION_Y: number = 30;
const POINT_LIGHT_COLOR: number = 0x7DFDFE;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
const MAP_SIZE: number = 512;

const AMBIENT_LIGHT_COLOR: number = 0xFFFFFF;
const AMBIENT_LIGHT_DISTANCE_OPACITY: number = 500;

@Injectable()
export class SceneLightsService {


    private scene: THREE.Scene;
    private pointLight: THREE.PointLight;
    private ambientLight: THREE.AmbientLight;

    public constructor() {
        this.scene = null;
        this.pointLight = null;
        this.ambientLight = null;
    }

    public initialize(scene: THREE.Scene): void {
        this.scene = scene;

        this.generateLights();
    }

    private generateLights(): void {
        this.generateAmbientLight();
        this.generatePointLights();
    }

    private generateAmbientLight(): void {
        this.ambientLight = new THREE.AmbientLight( AMBIENT_LIGHT_COLOR, AMBIENT_LIGHT_OPACITY);
        this.scene.add(this.ambientLight);
    }

    private generatePointLights(): void {
        this.addPointLight(0, 0);
        this.addPointLight(middlePointX, middlePointZ);
        this.addPointLight(-middlePointX, middlePointZ);
        this.addPointLight(middlePointX, -middlePointZ);
        this.addPointLight(-middlePointX, -middlePointZ);
    }


    private addPointLight(positionX: number, positionZ: number): void {
        this.pointLight = new THREE.PointLight( POINT_LIGHT_COLOR, 1, AMBIENT_LIGHT_DISTANCE_OPACITY);
        this.pointLight.castShadow = true;
        this.pointLight.shadow.mapSize.width = MAP_SIZE;
        this.pointLight.shadow.mapSize.height = MAP_SIZE;
        this.pointLight.position.y = POINT_LIGHT_POSITION_Y;
        this.pointLight.position.x = positionX;
        this.pointLight.position.z = positionZ;
        this.scene.add(this.pointLight);
    }
}


      // private directionalLight: THREE.DirectionalLight;
      // this.directionalLight.shadow.camera.position.copy(this.cameraService.orthographicCamera.position);

       /* this.directionalLight = new THREE.DirectionalLight(WHITE, AMBIENT_LIGHT_OPACITY);
        this.directionalLight.castShadow = true;
        this.directionalLight.position.set( 0, 500, 500 );
        this.directionalLight.shadow.camera.visible = true;

        this.directionalLight.shadow.mapSize.width = 512*8;
        this.directionalLight.shadow.mapSize.height = 512*8;

        this.directionalLight.shadow.camera.near = ORTHOGRAPHIC_CAMERA_NEAR_PLANE*5;
        this.directionalLight.shadow.camera.far = ORTHOGRAPHIC_CAMERA_FAR_PLANE*5;

        this.directionalLight.shadow.camera.left = -ORTHOGRAPHIC_FIELD_OF_VIEW*5;
        this.directionalLight.shadow.camera.right = ORTHOGRAPHIC_FIELD_OF_VIEW*5;
        this.directionalLight.shadow.camera.top = ORTHOGRAPHIC_FIELD_OF_VIEW*5;
        this.directionalLight.shadow.camera.bottom = -ORTHOGRAPHIC_FIELD_OF_VIEW*5;*/

        // this.scene.add(this.directionalLight);