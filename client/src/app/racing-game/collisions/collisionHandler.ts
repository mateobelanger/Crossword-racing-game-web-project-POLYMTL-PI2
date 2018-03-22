import * as THREE from "three";
import { Car } from "../car/car";
// import { Collision } from "./collision";

// const NUMBER_OF_RAYCASTERS: number = 32;
// const COLLISION_DISTANCE: number = 10;

export class CollisionHandler {

    // private _collision: Collision;
    // private _cars: Car[];
    // private scene: THREE.Scene;

    public constructor(cars: Car[]) {
        // this._cars = cars;
        // this.scene = scene;
    }

    public handleCarCollisions(cars: Car[], scene: THREE.Scene): void {

        if (cars[0].box.intersectsBox(cars[1].box)) {
            console.log("collision");
            this.switchCarsSpeed(cars[0], cars[1]);
            this.showCollision(cars[0], cars[1], scene);
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
        // console.log( car1.getSpeed());
        const temp: THREE.Vector3 = car1.getSpeed().clone();
        car1.speed = car2.getSpeed().clone();
        car2.speed = temp;

    }

    private showCollision(car1: Car, car2: Car, scene: THREE.Scene): number {

        const car1Position: THREE.Vector3 = car1.getPosition();
        const car2Position: THREE.Vector3 = car2.getPosition();
        // const vector: THREE.Vector3 = new THREE.Vector3(car2Position.x - car1Position.x, 0, car2Position.z - car1Position.z);

        // pour afficher les collisions
        const material: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        const geometry: THREE.Geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3( car1Position.x, 1, car1Position.z ),
            new THREE.Vector3( car2Position.x, 1, car2Position.z)
        );
        const line: THREE.Line = new THREE.Line( geometry, material );
        scene.add( line );

        return 0;
    }


    // private getCollidableObjects(): THREE.Object3D[] {
    //     const collidableObjects: THREE.Object3D[] = [];
    //     this.scene.children.forEach( (child) => {
    //         if (child.type === "Object3D") {
    //             collidableObjects.push(child);
    //         }
    //     });

    //     return collidableObjects;
    // }

    // public detectCollisions(): Collision {
    //     // console.log(this._car.speed);
    //     const carRaycasters: THREE.Raycaster[] = this.createRaycasters();

    //     let collision: Collision;
    //     for (let i: number = 0; i < NUMBER_OF_RAYCASTERS ; i++) {
    //         let intersections: any[] = [];
    //         intersections = carRaycasters[i].intersectObjects(this.getCollidableObjects(), true);
    //         // Because we don't want to go through the whole loop once a collision has been detected :
    //         // tslint:disable-next-line:prefer-for-of
    //         for (let j: number = 0; j < intersections.length; j++) {
    //             if (intersections[j].distance < COLLISION_DISTANCE) {
    //                 console.log("collision");
    //                 console.log(intersections[j].object.id);
    //                 collision = new Collision(this.car, intersections[j].object, carRaycasters[i].ray.direction);
    //                 break;
    //             }
    //         }
    //         if (collision) {
    //             break;
    //         }
    //     }

    //     return collision;

    // }

    // private createRaycasters(): THREE.Raycaster[] {
    //     const carRaycasters: THREE.Raycaster[] = [];
    //     const vector: THREE.Vector3 = new THREE.Vector3(this.car.direction.x, this.car.direction.y, this.car.direction.z);
    //     const axis: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
    //     const angle: number = 2 * Math.PI / NUMBER_OF_RAYCASTERS;

    //     for (let i: number = 0; i < NUMBER_OF_RAYCASTERS; i++) {
    //         vector.applyAxisAngle(axis, angle);
    //         carRaycasters.push(new THREE.Raycaster(this.car.mesh.position, vector.normalize()));

    //         // POUR VOIR LES RAYCASTERS
    //         // var material = new THREE.LineBasicMaterial({ color: 0x000000 });
    //         // var geometry = new THREE.Geometry();
    //         // geometry.vertices.push(
    //         //     new THREE.Vector3( this._car._mesh.position.x, 1, this._car._mesh.position.z ),
    //         //     new THREE.Vector3( this._car._mesh.position.x + vector.x * 20, 1, this._car._mesh.position.z + vector.z * 20 )
    //         // );
    //         // var line = new THREE.Line( geometry, material );
    //         // this.scene.add( line );
    //     }

    //     return carRaycasters;
    // }

}
