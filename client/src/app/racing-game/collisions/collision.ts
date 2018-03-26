import * as THREE from "three";
import { Car } from "../cars/car/car";
import { CollisionType } from "../constants";

const TWO_HUNDRED_AND_SEVENTY_DEGREES_IN_RAD: number = 4.71238898;
const NINETY_DEGREES_IN_RAD: number = 1.570796327;
const FIVE_DEGREES_IN_RAD: number = 0.087266462;
const FRAMES_PER_RAD: number = 30;

export class Collision {

    private _frontCar: Car;
    private _backCar: Car;
    private _type: CollisionType;
    public rotationPerFrame: number; // in radians
    public remainingFrames: number;

    public constructor(firstCollidedObject: Car, secondCollidedObject: Car) {
        this.establishCollisionType(firstCollidedObject, secondCollidedObject);
        this.establishRotationPerFrame();
    }

    public get frontCar(): Car {
        return this._frontCar;
    }

    public get backCar(): Car {
        return this._backCar;
    }

    public get type(): CollisionType {
        return this._type;
    }

    public contains(car: Car): boolean {
        return this._frontCar === car || this._backCar === car;
    }

    private establishCollisionType(car1: Car, car2: Car): void {
        if (this.isCarHitByOtherCar(car1, car2) && this.isCarHitByOtherCar(car2, car1)) {
            this.assignCars(car1, car2);
            this._type = CollisionType.FACE_TO_FACE;

            return;
        }

        if (this.isCarHitByOtherCar(car1, car2)) {
            this.assignCars(car1, car2);
        } else {
            this.assignCars(car2, car1);
        }

        this._type = this.isFrontCarHitFromLeft() ? CollisionType.FRONT_CAR_HIT_FROM_LEFT : CollisionType.FRONT_CAR_HIT_FROM_RIGHT;

    }

    private assignCars(car1: Car, car2: Car): void {
        this._frontCar = car1;
        this._backCar = car2;
    }

    private isCarHitByOtherCar(car1: Car, car2: Car): boolean {
        const car1Position: THREE.Vector3 = car1.getPosition();
        const car2Position: THREE.Vector3 = car2.getPosition();
        const vectorToCar2: THREE.Vector3 = new THREE.Vector3(car2Position.x - car1Position.x, 0, car2Position.z - car1Position.z);

        return car1.direction.angleTo(vectorToCar2) >= NINETY_DEGREES_IN_RAD &&
            car1.direction.angleTo(vectorToCar2) <= TWO_HUNDRED_AND_SEVENTY_DEGREES_IN_RAD;
    }

    private isFrontCarHitFromLeft(): boolean {
        const frontCarPosition: THREE.Vector3 = this._frontCar.getPosition();
        const backCarPosition: THREE.Vector3 = this._backCar.getPosition();

        const vectorToFrontCar: THREE.Vector3 =
            new THREE.Vector3(frontCarPosition.x - backCarPosition.x, 0, frontCarPosition.z - backCarPosition.z);
        const angle1: number = this._backCar.direction.angleTo(vectorToFrontCar);

        return this._backCar.direction.angleTo(vectorToFrontCar.applyAxisAngle(new THREE.Vector3(0, 1, 0), FIVE_DEGREES_IN_RAD)) < angle1;
    }

    private establishRotationPerFrame(): void {
        let rotation: number;
        switch (this._type) {
            case CollisionType.FACE_TO_FACE:
                rotation = (Math.PI / 2);
                break;
            default:
                rotation = this._frontCar.direction.angleTo(this._backCar.direction);
                break;
        }
        (this.remainingFrames = rotation * FRAMES_PER_RAD) === 0 ?
            this.rotationPerFrame = 0 : this.rotationPerFrame = rotation / this.remainingFrames;
    }
}
