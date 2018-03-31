import * as THREE from "three";
import { Car } from "./car/car";
// import { TRACK_WIDTH } from "../constants";

// const DISTANCE_BETWEEN_CARS: number = 10;
const CAR_INIT_DIRECTION: THREE.Vector3 = new THREE.Vector3(-1, 0, 0);

export class CarStartPosition {
    private _start: THREE.Vector3;
    private  _2ndWaypoint: THREE.Vector3;

    public constructor( private _cars: Car[], waypoints: [number, number, number ][]) {
        this._start = new THREE.Vector3(waypoints[0][0],
                                        waypoints[0][1],
                                        waypoints[0][2]);
        this._2ndWaypoint = new THREE.Vector3(waypoints[1][0],
                                              waypoints[1][1],
                                              waypoints[1][2]);
    }

    public moveCarsToStart(): void {
        const  startingTrackDirection: THREE.Vector3 = new THREE.Vector3();
        startingTrackDirection.subVectors(this._2ndWaypoint, this._start);

        this._cars.forEach( (car: Car, startPosition: number) => {
            this.moveCarToStart(car);
            this.alignCarWithTrack(car, startingTrackDirection);
            this.positionCar(startPosition);
        });

    }

    private moveCarToStart( car: Car ): void {
        car.mesh.position.set(this._start.x,
                              this._start.y,
                              this._start.z);
    }

    private alignCarWithTrack(car: Car, trackDirection: THREE.Vector3): void {
        let rotation: number = trackDirection.angleTo(CAR_INIT_DIRECTION);
        if (trackDirection.z < 0)
            rotation *= -1;

        car.mesh.rotateOnAxis( new THREE.Vector3(0, 1, 0), rotation);
    }

    private positionCar( position: number ): void {

    }
}
