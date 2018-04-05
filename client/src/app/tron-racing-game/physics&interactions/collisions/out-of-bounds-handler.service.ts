import { Injectable } from '@angular/core';
import * as THREE from "three";
import { Car } from "../cars/car/car";
import { TRACK_WIDTH } from "../../constants";
import { RaceProgression } from '../../raceData/raceProgression/raceProgression';
import { AudioService, FORCE_FIELD_SOUND } from '../../audio/audio.service';
import { CarHandlerService } from '../cars/car-handler.service';
import { RaceProgressionHandlerService } from '../../raceData/raceProgression/race-progression-handler.service';
import { Quaternion } from 'three';

const SLOWDOWN_FACTOR: number = 1.15;
const CAR_WIDTH: number = 1;

@Injectable()
export class OutOfBoundsHandlerService {

    private _cars: [RaceProgression, Car][] = [];

    public constructor( private audioService: AudioService,
                        private carsHandlerService: CarHandlerService,
                        private raceProgressionService: RaceProgressionHandlerService) { }

    public initialize(): void {
        this.carsHandlerService.cars.forEach( (car: [string, Car]) => {
            this._cars.push([this.raceProgressionService.getPlayerProgression(car[0]), car[1]]);
        });
    }

    public handleWallCollisions(): void {
        this._cars.forEach( (raceCar: [RaceProgression, Car]) => {
            const progression: RaceProgression = raceCar[0];
            const car: Car = raceCar[1];

            if (!this.isCarinTrack(car, progression)) {

                const rotationFactor: number = 0.1;
                const trackDirection: THREE.Vector3 = progression.getCurrentTrackSegment().normalize();
                const carDirection: THREE.Vector3 = new THREE.Vector3(0, 0, 1)
                                                        .applyMatrix4(new THREE.Matrix4().extractRotation(car.mesh.matrix));

                // gradually rotates the car to be parallel with the track
                car.mesh.quaternion.slerp(new Quaternion().setFromUnitVectors(carDirection, trackDirection),  rotationFactor);

                // adjust car speed after collison
                car.speed = car.speed.setLength(car.speed.length() / SLOWDOWN_FACTOR);

                // plays wall collision sound
                this.audioService.playSound(FORCE_FIELD_SOUND);
            }
        });
    }

    private isCarinTrack(car: Car, carProgression: RaceProgression): boolean {
        const positionFromLastWaypoint: THREE.Vector3 = this.getPositionFromLastWaypoint(car, carProgression);
        const projection: THREE.Vector3 = positionFromLastWaypoint.clone().projectOnVector(carProgression.getCurrentTrackSegment());

        const distanceFromTrackCenter: THREE.Vector3 = new THREE.Vector3();
        distanceFromTrackCenter.subVectors(projection, this.getPositionFromLastWaypoint(car, carProgression));

        return distanceFromTrackCenter.length() <= (TRACK_WIDTH / 2 - CAR_WIDTH);
    }

    private getPositionFromLastWaypoint(car: Car, progression: RaceProgression): THREE.Vector3 {
        return new THREE.Vector3().subVectors(car.mesh.position, progression.currentWaypointPosition);
    }
}
