import { Injectable } from '@angular/core';
import { Car } from "../cars/car/car";
import { TRACK_WIDTH } from "../../constants";
import { RaceProgression } from '../../raceData/raceProgression/raceProgression';
import { AudioService, FORCE_FIELD_SOUND } from '../../audio/audio.service';
import { CarHandlerService } from '../cars/car-handler.service';
import { RaceProgressionHandlerService } from '../../raceData/raceProgression/race-progression-handler.service';
import { Vector3, Quaternion } from "three";

const SLOWING_FACTOR: number = 0.05;
const ROTATION_FACTOR: number = 0.05;
const TRANSLATION_FACTOR: number = 0.1;
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
        this._cars.forEach((raceCar: [RaceProgression, Car]) => {
            const progression: RaceProgression = raceCar[0];
            const car: Car = raceCar[1];

            if (!this.isCarinTrack(car, progression)) {
                const trackDirection: Vector3 = progression.getCurrentTrackSegment().normalize();

                // relative rotation quaternion to bring the car parallel to the track
                const rotationQuaternion: Quaternion = new Quaternion().setFromUnitVectors(car.direction, trackDirection);

                // calculates absolute rotation quaternion from car's current quaternion
                rotationQuaternion.multiply(car.mesh.quaternion);

                // translate car a bit towards center of track to prevent getting stuck outside the limit
                car.mesh.position.add(this.getTrackRejectionVector(car, progression).setLength(-TRANSLATION_FACTOR));

                // gradually rotates the car
                car.mesh.quaternion.slerp(rotationQuaternion,  ROTATION_FACTOR);

                // adjust car speed after collison
                car.speed = car.speed.setLength(car.speed.length() * (1 - SLOWING_FACTOR));

                // play wall collision sound
                this.audioService.playSound(FORCE_FIELD_SOUND);
            }
        });
    }

    private isCarinTrack(car: Car, progression: RaceProgression): boolean {
        return this.getTrackRejectionVector(car, progression).length() <= TRACK_WIDTH / 2 - CAR_WIDTH;
    }

    // computes the rejection vector of the car position relative to the track by the track segment
    private getTrackRejectionVector(car: Car, progression: RaceProgression): Vector3 {
        const projection: Vector3 = this.getPositionFromLastWaypoint(car, progression)
                                            .projectOnVector(progression.getCurrentTrackSegment());

        return this.getPositionFromLastWaypoint(car, progression).sub(projection);
    }

    private getPositionFromLastWaypoint(car: Car, progression: RaceProgression): Vector3 {
        return car.mesh.position.clone().sub ( progression.currentWaypointPosition );
    }
}
