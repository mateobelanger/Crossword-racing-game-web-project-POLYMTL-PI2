
import * as THREE from "three";

const FRONT_LIGHT_COLOR: number = 0x7DFDFE;
const BACK_LIGHT_COLOR: number = 0xF66A35;

const FRONT_TARGET_POSITION_X: number = 0;
const FRONT_TARGET_POSITION_Y: number = 3;
const FRONT_TARGET_POSITION_Z: number = -20;

const FRONT_LIGHT_ITENSITY: number = 20;
const FRONT_LIGHT_DISTANCE: number = 70;
// tslint:disable-next-line:no-magic-numbers
const FRONT_LIGHT_ANGLE: number = Math.PI / 3;
const FRONT_LIGHT_PENUMBRA: number = 0.5;
const FRONT_LIGHT_DECAY: number = 3;

const FRONT_LIGHT_POSITION_X: number = 0.6;
const FRONT_LIGHT_POSITION_Y: number = 3;
const FRONT_LIGHT_POSITION_Z: number = -0.2;

const BACK_TARGET_POSITION_X: number = 0;
const BACK_TARGET_POSITION_Y: number = 3;
const BACK_TARGET_POSITION_Z: number = 20;

const BACK_LIGHT_ITENSITY: number = 10;
const BACK_LIGHT_DISTANCE: number = 40;
// tslint:disable-next-line:no-magic-numbers
const BACK_LIGHT_ANGLE: number = Math.PI / 8;
const BACK_LIGHT_PENUMBRA: number = 0.5;
const BACK_LIGHT_DECAY: number = 3;

const BACK_LIGHT_POSITION_X: number = 1.5;
const BACK_LIGHT_POSITION_Y: number = 3;
const BACK_LIGHT_POSITION_Z: number = -4.5;

export class CarLights {

    private _frontLeftLight: THREE.SpotLight;
    private _frontRightLight: THREE.SpotLight;
    private _backLeftLight: THREE.SpotLight;
    private _backRightLight: THREE.SpotLight;
    private car: THREE.Object3D;

    public constructor() {
        this._frontLeftLight = null;
        this._frontRightLight = null;
        this._backLeftLight = null;
        this._backRightLight = null;
    }

    public initialize(car: THREE.Object3D): void {
        this.car = car;

        this.generateLights();
    }

    public switchLights(): void {
        this._frontLeftLight.visible = !this._frontLeftLight.visible;
        this._frontRightLight.visible = !this._frontRightLight.visible;
        this._backLeftLight.visible = !this._backLeftLight.visible;
        this._backRightLight.visible = !this._backRightLight.visible;
    }

    private generateLights(): void {
        this.generateFrontLights();
        this.generateBackLights();
    }

    private generateFrontLights(): void {
        this.generateFrontTarget();
        this._frontLeftLight = this.generateFrontLight(FRONT_LIGHT_POSITION_X);
        this._frontRightLight = this.generateFrontLight(-FRONT_LIGHT_POSITION_X);
    }

    private generateFrontLight(positionX: number): THREE.SpotLight {
        const frontLight: THREE.SpotLight = new THREE.SpotLight(FRONT_LIGHT_COLOR, FRONT_LIGHT_ITENSITY,
                                                                FRONT_LIGHT_DISTANCE, FRONT_LIGHT_ANGLE,
                                                                FRONT_LIGHT_PENUMBRA, FRONT_LIGHT_DECAY);

        this.car.add(frontLight);
        frontLight.position.set(positionX, FRONT_LIGHT_POSITION_Y, FRONT_LIGHT_POSITION_Z);

        const frontTarget: THREE.Object3D = this.generateFrontTarget();
        frontLight.target = frontTarget;

        return frontLight;
    }

    private generateFrontTarget(): THREE.Object3D {
        const frontTarget: THREE.Object3D = new THREE.Object3D();
        this.car.add(frontTarget);
        frontTarget.position.set(FRONT_TARGET_POSITION_X, FRONT_TARGET_POSITION_Y, FRONT_TARGET_POSITION_Z);

        return frontTarget;
    }

    private generateBackLights(): void {
        this.generateFrontTarget();
        this._backLeftLight = this.generateBackLight(BACK_LIGHT_POSITION_X);
        this._backRightLight = this.generateBackLight(-BACK_LIGHT_POSITION_X);
    }

    private generateBackLight(positionX: number): THREE.SpotLight {
        const backLight: THREE.SpotLight = new THREE.SpotLight(BACK_LIGHT_COLOR, BACK_LIGHT_ITENSITY,
                                                               BACK_LIGHT_DISTANCE, BACK_LIGHT_ANGLE,
                                                               BACK_LIGHT_PENUMBRA, BACK_LIGHT_DECAY);

        this.car.add(backLight);
        backLight.position.set(positionX, BACK_LIGHT_POSITION_Y, BACK_LIGHT_POSITION_Z);

        const backTarget: THREE.Object3D = this.generateBackTarget();
        backLight.target = backTarget;

        return backLight;
    }

    private generateBackTarget(): THREE.Object3D {
        const backTarget: THREE.Object3D = new THREE.Object3D();
        this.car.add(backTarget);
        backTarget.position.set(BACK_TARGET_POSITION_X, BACK_TARGET_POSITION_Y, BACK_TARGET_POSITION_Z);

        return backTarget;
    }
}
