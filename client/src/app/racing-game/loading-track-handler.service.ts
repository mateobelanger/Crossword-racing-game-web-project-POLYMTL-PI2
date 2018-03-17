import { Injectable } from '@angular/core';
import { Waypoint } from './track/trackData/waypoint';
import { PlaneHandler } from './track/trackBuildingBlocks/planeHandler';
import * as THREE from "three";

// ***
const X: number = 0;
const Y: number = 1;
const Z: number = 2;


const SCENE_SCALE: number = 1;

@Injectable()
export class LoadingTrackHandlerService {

    public points: number[][];
    private _waypoints: Waypoint[];
    private planeHandler: PlaneHandler;
    private scene: THREE.Scene;


    public constructor() {
        this.points = [];
        this._waypoints = [];
    }

    public get waypoints(): Waypoint[] {
        return this._waypoints;
    }

    public initialize(scene: THREE.Scene): void {
        this.scene = scene;
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
      this.planeHandler = new PlaneHandler(this.scene);
      this.planeHandler.generatePlanes(this._waypoints, true);
      // generate the last segment between last and first waypoints to close track
      const waypoints: Waypoint[] = [this._waypoints[this._waypoints.length - 1], this._waypoints[0]];
      this.planeHandler.generatePlanes(waypoints, true);
    }

    /*
    private addWaypointsToScene(): void {
        this.circleHandler = new CircleHandler(this.scene);
        this.circleHandler.generateCircles(this._waypoints, true);
    }*/

}
