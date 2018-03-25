import * as THREE from "three";
import { Car } from "./car/car";
// import { TRACK_WIDTH } from "../constants";

// const DISTANCE_BETWEEN_CARS: number = 10;
const CAR_INIT_DIRECTION: THREE.Vector3 = new THREE.Vector3(-1, 0, 0);

export class CarStartPosition {
    private _start: THREE.Vector3;
    private  _end: THREE.Vector3;

    public constructor( private _cars: Car[], waypoints: [number, number, number ][]) {
        this._start = new THREE.Vector3(waypoints[0][0],
                                        waypoints[0][1],
                                        waypoints[0][2]);
        this._end = new THREE.Vector3(waypoints[waypoints.length - 1][0],
                                      waypoints[waypoints.length - 1][1],
                                      waypoints[waypoints.length - 1][2]);
    }

    public moveCarsToStart(): void {
        const  startingTrackDirection: THREE.Vector3 = new THREE.Vector3();
        startingTrackDirection.subVectors(this._start, this._end);

        this._cars.forEach( (car: Car, startPosition: number) => {
            this.moveCarToStart(car);
            this.alignCarWithTrack(car, startingTrackDirection);
            this.positionCar(startPosition);
        });

    }

    private moveCarToStart( car: Car ): void {
        car.mesh.position.add(this._start);
        console.log(this._start);
        console.log(car.mesh.position);
    }

    private alignCarWithTrack(car: Car, trackDirection: THREE.Vector3): void {
        let rotation: number = trackDirection.angleTo(CAR_INIT_DIRECTION);
        if (trackDirection.y < 0)
            rotation *= -1;
        car.mesh.rotateOnAxis( new THREE.Vector3(), rotation);
    }

    private positionCar( position: number ): void {

    }
}
