import * as THREE from "three";
import { Car } from "../car/car";
import { CollisionType } from "../constants";


export class Collision {

    private _frontCar: Car;
    private _backCar: Car;
    private _type: CollisionType;

    public constructor( firstCollidedObject: Car, secondCollidedObject: Car) {
        this.establishCollisionType(firstCollidedObject, secondCollidedObject);
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
        if (this.getsHitBy(car1, car2) && this.getsHitBy(car2, car1)) {
            this.assignCars(car1, car2);
            this._type = CollisionType.FACE_TO_FACE;
            console.log("les 2 autos se rentrent dedans");
        } else if (this.getsHitBy(car1, car2)) {
            this.assignCars(car1, car2);
            this._type = CollisionType.FIRST_CAR_HIT;
            console.log("car1 se fait rentrer dedans");
        } else {
            this.assignCars(car2, car1);
            this._type = CollisionType.SECOND_CAR_HIT;
            console.log("car2 se fait rentrer dedans");
        }
    }

    private assignCars(car1: Car, car2: Car): void {
        this._frontCar = car1;
        this._backCar = car2;
    }

    private getsHitBy(car1: Car, car2: Car): boolean {
        const car1Position: THREE.Vector3 = car1.getPosition();
        const car2Position: THREE.Vector3 = car2.getPosition();
        const vectorCar1: THREE.Vector3 = new THREE.Vector3(car2Position.x - car1Position.x, 0, car2Position.z - car1Position.z);

        return car1.direction.angleTo(vectorCar1) >= Math.PI / 2 && car1.direction.angleTo(vectorCar1) <= 3 * Math.PI / 2;
    }
}
