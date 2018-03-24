import * as THREE from "three";
import { Car } from "../car/car";
import { Collision } from "./collision";
import {CollisionType} from "../constants";

export class CollisionHandler {

    private _collisions: Collision[];
    private _cars: Car[];

    public constructor(cars: Car[]) {
        this._collisions = [];
        this._cars = cars;
    }

    private isNewCollision(car1: Car, car2: Car): boolean {

        let isNewCollision: boolean = true;
        this._collisions.forEach( (collision: Collision) => {
            if (collision.contains(car1) && collision.contains(car2)) {
                isNewCollision = false;
            }
        });

        return isNewCollision;
    }

    public handleCarCollisions(cars: Car[], scene: THREE.Scene): void {

        this.updateCollisions();

        // go through all possibilities of cars colliding
        for (let i: number = 0; i < this._cars.length; i++) {
            for (let j: number = i + 1; j < this._cars.length; j++) {
                if (this._cars[i].box.intersectsBox(cars[j].box)) {
                    this.handleCollision(this._cars[i], this._cars[j], scene);
                }
            }
        }

        this.applyCollisionRotations();

    }

    private handleCollision(car1: Car, car2: Car, scene: THREE.Scene): void {
        if (this.isNewCollision(car1, car2)) {
            // TODO : ligne a enlever avant la remise
            this.showCollision(car1, car2, scene);

            const newCollision: Collision = new Collision(car1, car2);
            this._collisions.push(newCollision);
            // this.rotateCars(newCollision.backCar, newCollision.frontCar);
            this.switchCarsSpeed(car1, car2);
        }
    }

    private updateCollisions(): void {

        const collisionIndexesToRemove: number[] = [];
        this._collisions.forEach( (collision: Collision, index: number) => {
            if (!collision.frontCar.box.intersectsBox(collision.backCar.box) && collision.remainingFrames <= 0) {
                collisionIndexesToRemove.push(index);
            }
        });

        for (const index of collisionIndexesToRemove) {
            this._collisions.splice(index, 1);
        }

    }

    private switchCarsSpeed(car1: Car, car2: Car): void {
        const temp: THREE.Vector3 = car1.getSpeed().clone();
        car1.speed = car2.getSpeed().clone();
        car2.speed = temp;
    }

    /*private rotateCars(car1: Car, car2: Car): void {

        // doesn't really work
        switch (this._collisions[0].type) {
            case CollisionType.FACE_TO_FACE:    // car1.rotate(Math.PI);
                                                // car2.rotate(Math.PI);
                                                break;
            case CollisionType.FIRST_CAR_HIT:   car1.rotate(-car1.direction.angleTo(car2.direction));
                                                break;
            case CollisionType.SECOND_CAR_HIT:
            default:    car2.rotate(-car2.direction.angleTo(car1.direction));
                        break;
        }

    }*/

    private applyCollisionRotations(): void {
        this._collisions.forEach( (collision: Collision) => {
            switch (collision.type) {
                case CollisionType.FACE_TO_FACE:
                    collision.frontCar.rotate(collision.rotationPerFrame);
                    collision.backCar.rotate(collision.rotationPerFrame);
                    break;
                case CollisionType.FIRST_CAR_HIT:
                    collision.backCar.rotate(collision.rotationPerFrame);
                    break;
                case CollisionType.SECOND_CAR_HIT:
                default:
                    collision.frontCar.rotate(collision.rotationPerFrame);
                    break;
            }
            collision.remainingFrames--;
            console.log(collision.remainingFrames);
        });
    }

    private showCollision(car1: Car, car2: Car, scene: THREE.Scene): void {

        const car1Position: THREE.Vector3 = car1.getPosition();
        const car2Position: THREE.Vector3 = car2.getPosition();

        // pour afficher les collisions
        const material: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        const geometry: THREE.Geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3( car1Position.x, 1, car1Position.z ),
            new THREE.Vector3( car2Position.x, 1, car2Position.z)
        );
        const line: THREE.Line = new THREE.Line( geometry, material );
        scene.add( line );

    }

}
