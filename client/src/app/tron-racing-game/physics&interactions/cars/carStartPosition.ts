import * as THREE from "three";
import { Car } from "./car/car";
import { ArrayHelper } from "../../../../../../server/app/lexicalService/arrayHelper";
import { TRACK_WIDTH } from "../../constants";

const DISTANCE_BETWEEN_CARS: number = 10;
const CAR_INIT_DIRECTION: THREE.Vector3 = new THREE.Vector3(-1, 0, 0);

export class CarStartPosition {
    private _start: THREE.Vector3;
    private  _2ndWaypoint: THREE.Vector3;
    private _numberOfStartingDuos: number;

    public constructor( private _cars: Car[], waypoints: [number, number, number ][]) {
        this._start = new THREE.Vector3(waypoints[0][0],
                                        waypoints[0][1],
                                        waypoints[0][2]);
        this._2ndWaypoint = new THREE.Vector3(waypoints[1][0],
                                              waypoints[1][1],
                                              waypoints[1][2]);
        this._numberOfStartingDuos = Math.ceil(this._cars.length / 2);
    }

    public moveCarsToStart(): void {
        const  startingTrackDirection: THREE.Vector3 = new THREE.Vector3();
        startingTrackDirection.subVectors(this._2ndWaypoint, this._start);
        this.shuffleCarStartPosition();

        this._cars.forEach( (car: Car, startPosition: number) => {
            this.moveCarToStart(car);
            this.alignCarWithTrack(car, startingTrackDirection);
            this.positionCar(car, startPosition);
        });

    }

    private shuffleCarStartPosition(): void {
        ArrayHelper.shuffle(this._cars);
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

    private positionCar( car: Car, position: number ): void {
        this.positionCarOnTrackLength(car, position);
        this.positionCarOnTrackWidth(car, position);
    }
    private positionCarOnTrackLength(car: Car, position: number): void {
        car.mesh.translateZ(-DISTANCE_BETWEEN_CARS * Math.ceil(this._numberOfStartingDuos - (position / 2)));
    }

    private positionCarOnTrackWidth(car: Car, position: number): void {
        car.mesh.translateX(this.isEven(position) ? TRACK_WIDTH / (2 + 2) : -TRACK_WIDTH / (2 + 2));
    }

    private isEven( x: number): boolean {
        return (x % 2) === 0;
    }
}
