import { Injectable } from "@angular/core";
import * as THREE from "three";

import { Waypoint } from "../tracks/trackData/waypoint";
import { PlaneHandler } from "../gameRendering/trackBuildingBlocks/planeHandler";
import { CircleHandler } from "../gameRendering/trackBuildingBlocks/circleHandler";

const X: number = 0;
const Y: number = 1;
const Z: number = 2;

const SCENE_SCALE: number = 1;

@Injectable()
export class TrackLoaderService {

    public points: number[][];
    private _waypoints: Waypoint[];
    private _planeHandler: PlaneHandler;
    private _circleHandler: CircleHandler;
    private _scene: THREE.Scene;

    public constructor() {
        this.points = [];
        this._waypoints = [];
    }

    public get waypoints(): Waypoint[] {
        return this._waypoints;
    }

    public initialize(scene: THREE.Scene): void {
        this._scene = scene;
        this._waypoints = [];
        this.setWaypointsFromPoints();
        this.addTrackToScene();
    }

    private setWaypointsFromPoints(): void {
        this.points.forEach( (element) => {
            const waypoint: Waypoint = new Waypoint();
            const scaledVector: THREE.Vector3 = new THREE.Vector3(element[X], element[Y], element[Z]);
            const lenght: number = scaledVector.length();
            scaledVector.normalize();
            scaledVector.multiplyScalar(SCENE_SCALE * lenght);
            waypoint.position =  scaledVector;
            this._waypoints.push(waypoint);
        });
    }

    private addTrackToScene(): void {
      this._planeHandler = new PlaneHandler(this._scene);
      this._planeHandler.generatePlanes(this._waypoints, true);
      // generate the last segment between last and first waypoints to close track
      const waypoints: Waypoint[] = [this._waypoints[this._waypoints.length - 1], this._waypoints[0]];
      this._planeHandler.generatePlanes(waypoints, true);
      this.addWaypointsToScene();
    }

    private addWaypointsToScene(): void {
        this._circleHandler = new CircleHandler(this._scene);
        this._circleHandler.generateCircles(this._waypoints, true);
    }
}
