import * as THREE from "three";
import { Car } from "../car/car";
import { Collision } from "./collision";
import { CollisionType } from "../constants";

// const NUMBER_OF_RAYCASTERS: number = 32;
// const COLLISION_DISTANCE: number = 10;

export class CollisionHandler {

    private _collision: Collision;
    // private _cars: Car[];
    // private scene: THREE.Scene;

    public constructor(cars: Car[]) {

        // this._cars = cars;
        // this.scene = scene;
    }

    public handleCarCollisions(cars: Car[], scene: THREE.Scene): void {

        if (cars[0].box.intersectsBox(cars[1].box)) {
            this.showCollision(cars[0], cars[1], scene);

            this._collision = new Collision(cars[0], cars[1]);

            this.rotateCars(cars[0], cars[1]);
            this.switchCarsSpeed(cars[0], cars[1]);

        }
        // TODO: appliquer a toutes les autos
        // cars.forEach( (car) => {
        //     cars.forEach( (otherCar) => {
        //         if (otherCar !== car) {
        //             if (car.box.intersectsBox(otherCar.box)) {
        //                 console.log("collision");
        //                 this.switchCarsSpeed(car, otherCar);
        //             }
        //         }
        //     }
        // });

    }

    private switchCarsSpeed(car1: Car, car2: Car): void {
        const temp: THREE.Vector3 = car1.getSpeed().clone();
        car1.speed = car2.getSpeed().clone();
        car2.speed = temp;
    }

    private rotateCars(car1: Car, car2: Car): void {

        // doesn't really work
        switch (this._collision.type) {
            case CollisionType.FACE_TO_FACE:    car1.rotate(Math.PI);
                                                car2.rotate(Math.PI);
                                                break;
            case CollisionType.FIRST_CAR_HIT:   car1.rotate(-car1.direction.angleTo(car2.direction));
                                                break;
            case CollisionType.SECOND_CAR_HIT:
            default:    car2.rotate(-car2.direction.angleTo(car1.direction));
                        break;
        }

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
