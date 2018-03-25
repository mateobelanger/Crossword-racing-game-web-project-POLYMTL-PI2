import { Injectable } from '@angular/core';
import * as THREE from "three";
import { EDITOR_LAND_HEIGHT, EDITOR_LAND_WIDTH } from '../constants';


const EDITOR_LAND_DIVISOR: number = 4;
const middlePointX: number = EDITOR_LAND_WIDTH / EDITOR_LAND_DIVISOR ;
const middlePointZ: number = EDITOR_LAND_HEIGHT / EDITOR_LAND_DIVISOR ;

const POINT_LIGHT_POSITION_Y: number = 30;
const POINT_LIGHT_COLOR: number = 0x7DFDFE;

const AMBIENT_LIGHT_OPACITY: number = 0.5;
const AMBIENT_LIGHT_COLOR: number = 0xFFFFFF;
const AMBIENT_LIGHT_DISTANCE_Y: number = 500;

const DIRECTIONAL_LIGHT_OPACITY: number = 0.8;
const DIRECTIONAL_LIGHT_COLOR: number = 0xFFFFFF;
const DIRECTIONAL_LIGHT_DISTANCE_Y: number = 1000;

const HEMISPHERE_LIGHT_OPACITY: number = 1;
const HEMISPHERE_SKY_COLOR: number = 0x000000;
const HEMISPHERE_GROUND_COLOR: number = 0xFFFFFF;
const HEMISPHERE_LIGHT_DISTANCE_OPACITY: number = 700;

export enum SceneState { DAY, NIGHT }

@Injectable()
export class SceneLightsService {

    private scene: THREE.Scene;
    private sceneState: SceneState;
    private pointLights: Array<THREE.PointLight>;
    private ambientLight: THREE.AmbientLight;
    private hemisphereLight: THREE.HemisphereLight;
    private directionalLight: THREE.DirectionalLight;


    public constructor() {
        this.scene = null;
        this.pointLights = [];
        this.ambientLight = null;
        this.directionalLight = null;
        this.hemisphereLight = null;
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
        this.directionalLight.visible = !this.directionalLight.visible;
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
        this.addDirectionalLight();
        this.addHemisphereLight();
    }

    private addAmbientLight(): void {
        this.generateAmbientLight();
        this.scene.add(this.ambientLight);
    }

    private generateAmbientLight(): void {
        this.ambientLight = new THREE.AmbientLight( AMBIENT_LIGHT_COLOR, AMBIENT_LIGHT_OPACITY);
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
        const pointLight: THREE.PointLight = new THREE.PointLight( POINT_LIGHT_COLOR, 1, AMBIENT_LIGHT_DISTANCE_Y);
        pointLight.position.y = POINT_LIGHT_POSITION_Y;
        pointLight.position.x = positionX;
        pointLight.position.z = positionZ;
        pointLight.visible = false;

        return pointLight;
    }

    private addDirectionalLight(): void {
        this.generateDirectionalLight();
        this.scene.add(this.directionalLight);
    }

    private generateDirectionalLight(): void {
        this.directionalLight = new THREE.DirectionalLight(DIRECTIONAL_LIGHT_COLOR, DIRECTIONAL_LIGHT_OPACITY);
        this.directionalLight.position.set( 0, DIRECTIONAL_LIGHT_DISTANCE_Y, 0 );
    }

    private addHemisphereLight(): void {
        this.generateHemisphereLight();
        this.scene.add(this.hemisphereLight);
    }

    private generateHemisphereLight(): void {
        this.hemisphereLight = new THREE.HemisphereLight(HEMISPHERE_SKY_COLOR,
                                                         HEMISPHERE_GROUND_COLOR,
                                                         HEMISPHERE_LIGHT_OPACITY);

        this.hemisphereLight.position.set(0, HEMISPHERE_LIGHT_DISTANCE_OPACITY, 0);

    }
}
