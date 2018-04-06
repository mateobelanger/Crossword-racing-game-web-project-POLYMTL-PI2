import * as THREE from "three";
import { Subject } from "rxjs/Subject";
import { MAX_N_LAPS } from "../../constants";

const WAYPOINT_RADIUS: number = 10;

export class RaceProgression {
    private _nLap: number;
    private _lapDone$: Subject<void>;
    private _currentWaypointIndex: number;
    private _nextWaypointPosition: THREE.Vector3;
    private _currentWaypointPosition: THREE.Vector3;
    private _previousWaypointPosition: THREE.Vector3;

    public constructor(private _carPosition: THREE.Vector3,
                       private _waypoints: [number, number, number][]) {
        this._nLap = 0;
        this._currentWaypointIndex = 0;

        this._nextWaypointPosition = new THREE.Vector3(
            this._waypoints[this.nextWaypointIndex][0],
            0,
            this._waypoints[this.nextWaypointIndex][2]
        );

        this._currentWaypointPosition = new THREE.Vector3(
            this._waypoints[this.currentWaypointIndex][0],
            0,
            this._waypoints[this.currentWaypointIndex][2]
        );

        this._previousWaypointPosition = new THREE.Vector3(
            this._waypoints[this.previousWaypointIndex][0],
            0,
            this._waypoints[this.previousWaypointIndex][2]
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
        let index: number = (this._currentWaypointIndex + 1)  % this._waypoints.length;
        if (index < 0)
            index += this._waypoints.length;

        return index;    }

    public get currentWaypointIndex(): number {
        let index: number = this._currentWaypointIndex % this._waypoints.length;
        if (index < 0)
            index += this._waypoints.length;

        return index;
    }

    public get previousWaypointIndex(): number {
        let index: number = (this._currentWaypointIndex - 1) % this._waypoints.length;
        if (index < 0)
            index += this._waypoints.length;

        return index;
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
        return this._nextWaypointPosition.clone().sub(this._currentWaypointPosition);
    }

    private reachedNextWaypoint(): boolean {
        return this.distanceToNextWaypoint() < WAYPOINT_RADIUS;
    }

    private reachedPreviousWaypoint(): boolean {
        return this.distanceToPreviousWaypoint() < WAYPOINT_RADIUS;
    }

    private incrementNextWaypointPosition(): void {
        this.incrementCurrentWaypointIndex();
        this.reassignWaypointPostion();
    }

    private decrementNextWaypointPosition(): void {
        this.decrementCurrentWaypointIndex();
        this.reassignWaypointPostion();
    }

    private incrementCurrentWaypointIndex(): void {
        this._currentWaypointIndex = (this._currentWaypointIndex + 1) % this._waypoints.length;

    }

    private decrementCurrentWaypointIndex(): void {
        let index: number = (this.nextWaypointIndex - 1) % this._waypoints.length;
        if (index < 0)
            index += this._waypoints.length;

        this._currentWaypointIndex  = index;
    }

    private reassignWaypointPostion(): void {
        this._previousWaypointPosition.set(
            this._waypoints[this.previousWaypointIndex][0],
            0,
            this._waypoints[this.previousWaypointIndex][2]
        );

        this._currentWaypointPosition.set(
            this._waypoints[this.currentWaypointIndex][0],
            0,
            this._waypoints[this.currentWaypointIndex][2]
        );


        this._nextWaypointPosition.set(
            this._waypoints[this.nextWaypointIndex][0],
            0,
            this._waypoints[this.nextWaypointIndex][2]
        );
    }

    private updateNLap(): void {
        if (this.currentWaypointIndex === 0) {
            this._nLap++;
            this._lapDone$.next();
        }
    }
}
