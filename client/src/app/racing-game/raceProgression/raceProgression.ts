import * as THREE from "three";
import { Subject } from "rxjs/Subject";
import { MAX_N_LAPS } from "../constants";

const WAYPOINT_RADIUS: number = 10;

export class RaceProgression {
    private _nLap: number;
    private _lapDone$: Subject<void>;
    private _nextWaypointIndex: number;
    private _nextWaypointPosition: THREE.Vector3;
    private _currentWaypointPosition: THREE.Vector3;
    private _previousWaypointPosition: THREE.Vector3;

    public constructor(private _carPosition: THREE.Vector3,
                       private _waypoints: [number, number, number][]) {
        this._nLap = -1;
        this._nextWaypointIndex = 0;

        this._nextWaypointPosition = new THREE.Vector3(
            this._waypoints[this._nextWaypointIndex + 1][0],
            0, // tslint:disable-next-line:no-magic-numbers
            this._waypoints[this._nextWaypointIndex + 1][2]
        );

        this._currentWaypointPosition = new THREE.Vector3(
            this._waypoints[this._nextWaypointIndex][0],
            0, // tslint:disable-next-line:no-magic-numbers
            this._waypoints[this._nextWaypointIndex][2]
        );

        this._previousWaypointPosition = new THREE.Vector3(
            this._waypoints[this._waypoints.length - 1][0],
            0, // tslint:disable-next-line:no-magic-numbers
            this._waypoints[this._waypoints.length - 1][2]
        );
        this._lapDone$ = new Subject();
    }

    public get nLap(): number {
        return this._nLap;
    }

    public get remainingNLap(): number {
        return MAX_N_LAPS - this._nLap;
    }

    public get lapDone$(): Subject<void> {
        return this._lapDone$;
    }

    public get nextWaypointIndex(): number {
        return this._nextWaypointIndex;
    }

    public get nextWaypointPosition(): THREE.Vector3 {
        return this._nextWaypointPosition;
    }

    public get currentWaypointPosition(): THREE.Vector3 {
        return this._currentWaypointPosition;
    }

    public update(): void {
        if (this.reachedNextWaypoint()) {
            this.incrementNextWaypointPosition();
            this.updateNLap();
        } else if (this.reachedPreviousWaypoint()) {
            this.decrementNextWaypointPosition();
        }
    }


    public distanceToNextWaypoint(): number {
        return this._carPosition.distanceTo(this._nextWaypointPosition);
    }

    public distanceToPreviousWaypoint(): number {
        return this._carPosition.distanceTo(this._previousWaypointPosition);
    }

    public getCurrentTrackSegment(): THREE.Vector3 {
        return new THREE.Vector3().subVectors(this._nextWaypointPosition, this._currentWaypointPosition);
    }

    private reachedNextWaypoint(): boolean {
        return this.distanceToNextWaypoint() < WAYPOINT_RADIUS;
    }

    private reachedPreviousWaypoint(): boolean {
        return this.distanceToPreviousWaypoint() < WAYPOINT_RADIUS;
    }

    // tslint:disable:no-magic-numbers
    private incrementNextWaypointPosition(): void {
        this.incrementNextWaypointIndex();
        this.incrementNextWaypointPostion();
    }

    private decrementNextWaypointPosition(): void {
        this.decrementNextWaypointIndex();
        this.decrementNextWaypointPostion();
    }

    private incrementNextWaypointIndex(): void {
        this._nextWaypointIndex = (this._nextWaypointIndex + 1) % this._waypoints.length;

    }

    private decrementNextWaypointIndex(): void {
        this._nextWaypointIndex = (this._nextWaypointIndex - 1) % this._waypoints.length;
    }

    private incrementNextWaypointPostion(): void {
        this._previousWaypointPosition = this._currentWaypointPosition;
        this._currentWaypointPosition = this._nextWaypointPosition;
        this._nextWaypointPosition = new THREE.Vector3(
            this._waypoints[this._nextWaypointIndex][0],
            0,
            this._waypoints[this._nextWaypointIndex][2]
        );
    }

    private decrementNextWaypointPostion(): void {
        this._nextWaypointPosition = this._currentWaypointPosition;
        this._currentWaypointPosition = this._previousWaypointPosition;
        this._previousWaypointPosition = new THREE.Vector3(
            this._waypoints[this._nextWaypointIndex][0],
            0,
            this._waypoints[this._nextWaypointIndex][2]
        );
    }

    private updateNLap(): void {
        if (this._nextWaypointIndex === 0) {
            this._nLap++;
            this._lapDone$.next();
        }
    }
}
