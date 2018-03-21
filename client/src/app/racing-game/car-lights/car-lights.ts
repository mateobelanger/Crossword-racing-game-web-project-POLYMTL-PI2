
import * as THREE from "three";

const FRONT_LIGHT_COLOR: number = 0x7DFDFE;

const FRONT_TARGET_POSITION_X: number = 0;
const FRONT_TARGET_POSITION_Y: number = 3;
const FRONT_TARGET_POSITION_Z: number = -20;

const FRONT_LIGHT_ITENSITY: number = 20;
const FRONT_LIGHT_DISTANCE: number = 70;
const FRONT_LIGHT_ANGLE: number = Math.PI / 3;
const FRONT_LIGHT_PENUMBRA: number = 0.5;
const FRONT_LIGHT_DECAY: number = 3;

const FRONT_LIGHT_POSITION_X: number = 0.6;
const FRONT_LIGHT_POSITION_Y: number = 3;
const FRONT_LIGHT_POSITION_Z: number = -0.2;


const BACK_LIGHT_COLOR: number = 0xF66A35;

const BACK_TARGET_POSITION_X: number = 0;
const BACK_TARGET_POSITION_Y: number = 3;
const BACK_TARGET_POSITION_Z: number = 20;

const BACK_LIGHT_ITENSITY: number = 10;
const BACK_LIGHT_DISTANCE: number = 40;
const BACK_LIGHT_ANGLE: number = Math.PI / 8;
const BACK_LIGHT_PENUMBRA: number = 0.5;
const BACK_LIGHT_DECAY: number = 3;

const BACK_LIGHT_POSITION_X: number = 1.5;
const BACK_LIGHT_POSITION_Y: number = 3;
const BACK_LIGHT_POSITION_Z: number = -4.5;


export class CarLights {

    private frontLeftLight: THREE.SpotLight;
    private frontRightLight: THREE.SpotLight;
    private backLeftLight: THREE.SpotLight;
    private backRightLight: THREE.SpotLight;
    private backLight: THREE.SpotLight;

    private car: THREE.Object3D;

    public constructor() {
        this.frontLeftLight = null;
        this.frontRightLight = null;
        this.backLeftLight = null;
        this.backRightLight = null;
        this.backLight = null;
    }

    public initialize(car: THREE.Object3D): void {
        this.car = car;

        this.generateLights();
    }

    public turnOffLights(): void {
        this.frontLeftLight.visible = !this.frontLeftLight.visible;
        this.frontRightLight.visible = !this.frontRightLight.visible;
        this.backLeftLight.visible = !this.backLeftLight.visible;
        this.backRightLight.visible = !this.backRightLight.visible;
    }

    private generateLights(): void {
        this.generateFrontLights();
        this.generateBackLights();
    }

    private generateFrontLights(): void {
        this.generateFrontTarget();
        this.frontLeftLight = this.generateFrontLight(FRONT_LIGHT_POSITION_X);
        this.frontRightLight = this.generateFrontLight(-FRONT_LIGHT_POSITION_X);
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
        this.backLeftLight = this.generateBackLight(BACK_LIGHT_POSITION_X);
        this.backRightLight = this.generateBackLight(-BACK_LIGHT_POSITION_X);
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
