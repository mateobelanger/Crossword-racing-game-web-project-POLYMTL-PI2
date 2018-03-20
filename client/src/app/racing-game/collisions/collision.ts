import * as THREE from "three";
import { Car } from "../car/car";


export class Collision {

    public _firstCollidedObject: THREE.Object3D;
    public _secondCollidedObject: THREE.Object3D;
    private _angle: number;

    public constructor( firstCollidedObject: Car,
                        secondCollidedObject: THREE.Object3D,
                        collisionDirection: THREE.Vector3) {
                            this._firstCollidedObject = firstCollidedObject;
                            this._secondCollidedObject = secondCollidedObject;
                            this._angle = firstCollidedObject.direction.angleTo(collisionDirection);
    }

    public get angle(): number {
        return this._angle;
    }

}
