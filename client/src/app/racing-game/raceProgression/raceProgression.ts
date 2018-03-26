import * as THREE from "three";
import { Subject } from "rxjs/Subject";
const WAYPOINT_RADIUS: number = 10;

export class RaceProgression {
    private _nLap: number;
    private _lapDone$: Subject<void>;
    private _nextWaypointIndex: number;
    private _nextWaypointPosition: THREE.Vector3;
    public constructor(private _carPosition: THREE.Vector3,
                       private _waypoints: [number, number, number][]) {
                           this._nLap = 0;
                           this._nextWaypointIndex = 0;
                           this._nextWaypointPosition = new THREE.Vector3(
                            this._waypoints[this._nextWaypointIndex][0],
                            this._waypoints[this._nextWaypointIndex][1], // tslint:disable-next-line:no-magic-numbers
                            this._waypoints[this._nextWaypointIndex][2]
                           );
                           this._lapDone$ = new Subject();
                       }

    public get nLap(): number {
        return this._nLap;
    }

    public get lapDone$(): Subject<void> {
        return this._lapDone$;
    }

    public get nextWaypointIndex(): number {
        return this._nextWaypointIndex;
    }

    public update(): void {
        if (this.distanceToNextWaypoint() < WAYPOINT_RADIUS) {
            this.incrementNextWaypointPosition();
            this.updateNLap();
            console.log(this._nextWaypointIndex);
            console.log(this._nLap);
        }
    }


    public distanceToNextWaypoint(): number {
        // tslint:disable-next-line:prefer-const
        return this._carPosition.distanceTo(this._nextWaypointPosition);
    }
    // tslint:disable:no-magic-numbers
    private incrementNextWaypointPosition(): void {
        this.incrementNextWaypointIndex();
        this.reassignNextWaypointIndex();
    }

    private incrementNextWaypointIndex(): void {
        this._nextWaypointIndex = (this._nextWaypointIndex + 1) % this._waypoints.length;
    }

    private reassignNextWaypointIndex(): void {
        this._nextWaypointPosition.set(
            this._waypoints[this._nextWaypointIndex][0],
            this._waypoints[this._nextWaypointIndex][1],
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
