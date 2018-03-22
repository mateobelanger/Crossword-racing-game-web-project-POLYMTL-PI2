import { Injectable } from '@angular/core';
import * as THREE from "three";
import { EDITOR_LAND_HEIGHT, EDITOR_LAND_WIDTH } from '../constants';
//import { ORTHOGRAPHIC_FIELD_OF_VIEW } from '../camera.service';

const EDITOR_LAND_DIVISOR: number = 4;
const middlePointX: number = EDITOR_LAND_WIDTH / EDITOR_LAND_DIVISOR ;
const middlePointZ: number = EDITOR_LAND_HEIGHT / EDITOR_LAND_DIVISOR ;

const POINT_LIGHT_POSITION_Y: number = 30;
const POINT_LIGHT_COLOR: number = 0x7DFDFE;
const AMBIENT_LIGHT_OPACITY_DAY: number = 0.5;
const AMBIENT_LIGHT_OPACITY_NIGHT: number = 0;
const MAP_SIZE: number = 512;

const AMBIENT_LIGHT_NAME: string = "ambientLight";
const AMBIENT_LIGHT_COLOR: number = 0xFFFFFF;
const AMBIENT_LIGHT_DISTANCE_OPACITY: number = 500;

export enum SceneState { DAY, NIGHT }

@Injectable()
export class SceneLightsService {


    private scene: THREE.Scene;
    private sceneState: SceneState;
    private pointLights: Array<THREE.PointLight>;
    private ambientLight: THREE.AmbientLight;
    //private directionalLight: THREE.DirectionalLight;


    public constructor() {
        this.scene = null;
        this.pointLights = [];
        this.ambientLight = null;
        //this.directionalLight = null;
        this.sceneState = SceneState.DAY;
    }

    public initialize(scene: THREE.Scene): void {
        this.scene = scene;
        this.pointLights  = new Array<THREE.PointLight>();
        this.generateSceneLights();
    }

    public updateScene(): void {
        this.changeSceneState();
        this.switchLights();
    }

    private switchLights(): void {
        this.ambientLight.visible = !this.ambientLight.visible;
        this.pointLights.forEach((light) => {
            light.visible = !light.visible;
        });
    }

    private changeSceneState(): void {
        this.sceneState = this.sceneState === SceneState.DAY ? SceneState.NIGHT : SceneState.DAY;
    }

    private generateSceneLights(): void {
        this.addAmbientLight();
        this.addPointLights();
        //this.generateDirectionalLight();
    }

    private addAmbientLight(): void {
        this.generateAmbientLight();
        this.scene.add(this.ambientLight);
    }

    private generateAmbientLight(): void {
        const opacity: number = this.sceneState === SceneState.DAY ? AMBIENT_LIGHT_OPACITY_DAY : AMBIENT_LIGHT_OPACITY_NIGHT;
        this.ambientLight = new THREE.AmbientLight( AMBIENT_LIGHT_COLOR, opacity);
        this.ambientLight.name = AMBIENT_LIGHT_NAME;
    }

    private addPointLights(): void {
        this.pointLights.push(this.generatePointLight(0, 0));
        this.pointLights.push(this.generatePointLight(middlePointX, middlePointZ));
        this.pointLights.push(this.generatePointLight(-middlePointX, middlePointZ));
        this.pointLights.push(this.generatePointLight(middlePointX, -middlePointZ));
        this.pointLights.push(this.generatePointLight(-middlePointX, -middlePointZ));

        this.pointLights.forEach((light) => {
            this.scene.add(light);
        });
    }

    private generatePointLight(positionX: number, positionZ: number): THREE.PointLight {
        const pointLight: THREE.PointLight = new THREE.PointLight( POINT_LIGHT_COLOR, 1, AMBIENT_LIGHT_DISTANCE_OPACITY);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = MAP_SIZE;
        pointLight.shadow.mapSize.height = MAP_SIZE;
        pointLight.position.y = POINT_LIGHT_POSITION_Y;
        pointLight.position.x = positionX;
        pointLight.position.z = positionZ;
        pointLight.visible = false;

        return pointLight;
    }
/*
    private generateDirectionalLight(): void {
        //this.directionalLight.shadow.camera.position.copy(this.cameraService.orthographicCamera.position);

        this.directionalLight = new THREE.DirectionalLight(AMBIENT_LIGHT_COLOR, AMBIENT_LIGHT_OPACITY_DAY);
        this.directionalLight.castShadow = true;
        this.directionalLight.position.set( - 400, 10, 0 );
        this.directionalLight.shadow.camera.visible = true;

        this.directionalLight.shadow.mapSize.width = 512*8;
        this.directionalLight.shadow.mapSize.height = 512*8;


        this.directionalLight.shadow.camera.near = 20;
        this.directionalLight.shadow.camera.far = 500;

        this.directionalLight.shadow.camera.left = -ORTHOGRAPHIC_FIELD_OF_VIEW*5;
        this.directionalLight.shadow.camera.right = ORTHOGRAPHIC_FIELD_OF_VIEW*5;
        this.directionalLight.shadow.camera.top = ORTHOGRAPHIC_FIELD_OF_VIEW*5;
        this.directionalLight.shadow.camera.bottom = -ORTHOGRAPHIC_FIELD_OF_VIEW*5;

        this.scene.add(this.directionalLight);
    }*/
}
