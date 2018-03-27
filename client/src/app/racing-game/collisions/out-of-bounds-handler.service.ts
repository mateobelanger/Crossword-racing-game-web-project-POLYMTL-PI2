import { Injectable } from '@angular/core';
import * as THREE from "three";
import { Car } from "../cars/car/car";
import { TRACK_WIDTH } from "../constants";
import { RaceProgression } from '../raceProgression/raceProgression';
import { RaceDataHandlerService } from '../race-data-handler.service';

const SLOWDOWN_FACTOR: number = 0.6;
const CAR_WIDTH: number = 1;

@Injectable()
export class OutOfBoundsHandlerService {

    private _cars: [RaceProgression, Car][] = [];

    public constructor(private raceData: RaceDataHandlerService) { }

    public initialize(): void {
        this.raceData.carsHandlerService.cars.forEach( (car: [string, Car]) => {
            this._cars.push([this.raceData.raceProgressionService.getPlayerProgression(car[0]), car[1]]);
        });
    }

    public handleCollisionOnTrackLimits(): void {
        // this._cars.forEach( (car) => {
            const car: [RaceProgression, Car] = this._cars[0];
            if (!this.isCarinTrack(car[1], car[0])) {
                const positionFromLastWaypoint = this.getPositionFromLastWaypoint(car[1], car[0]);
                const projection: THREE.Vector3 = positionFromLastWaypoint.clone().projectOnVector(car[0].getCurrentTrackSegment());
                car[1].speed.setLength(car[1].speed.length() * SLOWDOWN_FACTOR);
                car[1].mesh.position.addVectors(car[0].lastWaypointPosition, projection);
            }
        //});
    }
    
    private isCarinTrack(car: Car, carProgression: RaceProgression): boolean {
        const positionFromLastWaypoint = this.getPositionFromLastWaypoint(car, carProgression);
        const projection: THREE.Vector3 = positionFromLastWaypoint.clone().projectOnVector(carProgression.getCurrentTrackSegment());

        const distanceFromTrackCenter: THREE.Vector3 = new THREE.Vector3().subVectors(projection, this.getPositionFromLastWaypoint(car, carProgression));

        return distanceFromTrackCenter.length() <= TRACK_WIDTH / 2 - CAR_WIDTH;
    }

    private getPositionFromLastWaypoint(car: Car, progression: RaceProgression): THREE.Vector3 {
        return new THREE.Vector3().subVectors(car.mesh.position, progression.lastWaypointPosition);
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
