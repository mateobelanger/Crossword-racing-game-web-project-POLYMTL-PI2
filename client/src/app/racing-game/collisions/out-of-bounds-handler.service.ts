import { Injectable } from '@angular/core';
import * as THREE from "three";
import { Car } from "../cars/car/car";
import { TRACK_WIDTH } from "../constants";
import { RaceProgression } from '../raceProgression/raceProgression';
import { RaceDataHandlerService } from '../race-data-handler.service';

//const SLOWDOWN_FACTOR: number = 0.1;
@Injectable()
export class OutOfBoundsHandlerService {

    private _cars: [RaceProgression, Car][] = [];

    public constructor(private raceData: RaceDataHandlerService) {

    }

    public initialize(): void {
        this.raceData.carsHandlerService.cars.forEach( (car) => {
            this._cars.push([this.raceData.raceProgressionService.getPlayerProgression(car[0]), car[1]]);
        });
    }

    public handleCollisionOnTrackLimits(): void {
        this._cars.forEach( (car) => {
            if (!this.isCarinTrack(car[1], car[0])) {
                const trackLimitNormal: THREE.Vector3 = car[0].getCurrTrackSegmentVector();
                trackLimitNormal.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
                //car[1].speed = car[1].speed.reflect(trackLimitNormal.normalize()).multiplyScalar(SLOWDOWN_FACTOR);
            }
        });
    }
    private isCarinTrack(car: Car, carProgression: RaceProgression): boolean {
        let carPosRelativeToLastWaypoint: THREE.Vector3 = new THREE.Vector3();
        carPosRelativeToLastWaypoint.subVectors(car.mesh.position, carProgression.lastWaypointPosition);
        carPosRelativeToLastWaypoint.projectOnVector(carProgression.getCurrTrackSegmentVector());
        console.log(carProgression.getCurrTrackSegmentVector());
        carPosRelativeToLastWaypoint = carPosRelativeToLastWaypoint.sub(car.mesh.position);

        return carPosRelativeToLastWaypoint.length() <= TRACK_WIDTH/2;

    }

    /*
    private switchCarsSpeed(car1: Car, car2: Car): void {
        const temp: THREE.Vector3 = car1.getSpeed().clone();
        car1.speed = car2.getSpeed().clone();
        car2.speed = temp;
    }

    private rotateCars(car1: Car, car2: Car): void {

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
    */
}
