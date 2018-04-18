import { Injectable } from "@angular/core";
import * as THREE from "three";
import { EDITOR_LAND_HEIGHT, EDITOR_LAND_WIDTH } from "../../constants";

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

export enum _sceneState { DAY, NIGHT }

@Injectable()
export class SceneLightsService {

    private _scene: THREE.Scene;
    private _sceneState: _sceneState;
    private _pointLights: Array<THREE.PointLight>;
    private _ambientLight: THREE.AmbientLight;
    private _hemisphereLight: THREE.HemisphereLight;
    private _directionalLight: THREE.DirectionalLight;

    public constructor() {
        this._scene = null;
        this._pointLights = [];
        this._ambientLight = null;
        this._directionalLight = null;
        this._hemisphereLight = null;
        this._sceneState = _sceneState.DAY;
    }

    public initialize(_scene: THREE.Scene): void {
        this._scene = _scene;
        this._pointLights  = new Array<THREE.PointLight>();
        this.generateSceneLights();
    }

    public updateScene(): void {
        this.changeSceneState();
        this.switchLights();
    }

    private switchLights(): void {
        this._ambientLight.visible = !this._ambientLight.visible;
        this._directionalLight.visible = !this._directionalLight.visible;
        this._pointLights.forEach((light) => {
            light.visible = !light.visible;
        });
    }

    private changeSceneState(): void {
        this._sceneState = this._sceneState === _sceneState.DAY ? _sceneState.NIGHT : _sceneState.DAY;
    }

    private generateSceneLights(): void {
        this.addAmbientLight();
        this.addPointLights();
        this.addDirectionalLight();
        this.addHemisphereLight();
    }

    private addAmbientLight(): void {
        this.generateAmbientLight();
        this._scene.add(this._ambientLight);
    }

    private generateAmbientLight(): void {
        this._ambientLight = new THREE.AmbientLight( AMBIENT_LIGHT_COLOR, AMBIENT_LIGHT_OPACITY);
    }

    private addPointLights(): void {
        this._pointLights.push(this.generatePointLight(0, 0));
        this._pointLights.push(this.generatePointLight(middlePointX, middlePointZ));
        this._pointLights.push(this.generatePointLight(-middlePointX, middlePointZ));
        this._pointLights.push(this.generatePointLight(middlePointX, -middlePointZ));
        this._pointLights.push(this.generatePointLight(-middlePointX, -middlePointZ));

        this._pointLights.forEach((light) => {
            this._scene.add(light);
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
        this._scene.add(this._directionalLight);
    }

    private generateDirectionalLight(): void {
        this._directionalLight = new THREE.DirectionalLight(DIRECTIONAL_LIGHT_COLOR, DIRECTIONAL_LIGHT_OPACITY);
        this._directionalLight.position.set( 0, DIRECTIONAL_LIGHT_DISTANCE_Y, 0 );
    }

    private addHemisphereLight(): void {
        this.generateHemisphereLight();
        this._scene.add(this._hemisphereLight);
    }

    private generateHemisphereLight(): void {
        this._hemisphereLight = new THREE.HemisphereLight(  HEMISPHERE_SKY_COLOR,
                                                            HEMISPHERE_GROUND_COLOR,
                                                            HEMISPHERE_LIGHT_OPACITY);

        this._hemisphereLight.position.set(0, HEMISPHERE_LIGHT_DISTANCE_OPACITY, 0);

    }
}
