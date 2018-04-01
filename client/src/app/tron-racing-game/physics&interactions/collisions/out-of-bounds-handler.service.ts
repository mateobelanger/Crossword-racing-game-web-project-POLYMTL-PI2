import { Injectable } from '@angular/core';
import * as THREE from "three";
import { Car } from "../cars/car/car";
import { TRACK_WIDTH } from "../../constants";
import { RaceProgression } from '../../raceData/raceProgression/raceProgression';
import { AudioService, SOUND } from '../../audio/audio.service';
import { CarHandlerService } from '../cars/car-handler.service';
import { RaceProgressionHandlerService } from '../../raceData/raceProgression/race-progression-handler.service';

const SLOWDOWN_FACTOR: number = 0.6;
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

    public handleCollisionOnTrackLimits(): void {
        this._cars.forEach( (car) => {
            if (!this.isCarinTrack(car[1], car[0])) {
                const positionFromLastWaypoint: THREE.Vector3 = this.getPositionFromLastWaypoint(car[1], car[0]);
                const projection: THREE.Vector3 = positionFromLastWaypoint.clone().projectOnVector(car[0].getCurrentTrackSegment());
                car[1].speed.setLength(car[1].speed.length() * SLOWDOWN_FACTOR);
                car[1].mesh.position.addVectors(car[0].currentWaypointPosition, projection);
                this.audioService.playSound(SOUND.WALL_SOUND);
            }
        });
    }

    private isCarinTrack(car: Car, carProgression: RaceProgression): boolean {
        const positionFromLastWaypoint: THREE.Vector3 = this.getPositionFromLastWaypoint(car, carProgression);
        const projection: THREE.Vector3 = positionFromLastWaypoint.clone().projectOnVector(carProgression.getCurrentTrackSegment());

        const distanceFromTrackCenter: THREE.Vector3 = new THREE.Vector3();
        distanceFromTrackCenter.subVectors(projection, this.getPositionFromLastWaypoint(car, carProgression));

        return distanceFromTrackCenter.length() <= TRACK_WIDTH / 2 - CAR_WIDTH;
    }

    private getPositionFromLastWaypoint(car: Car, progression: RaceProgression): THREE.Vector3 {
        return new THREE.Vector3().subVectors(car.mesh.position, progression.currentWaypointPosition);
    }
}
