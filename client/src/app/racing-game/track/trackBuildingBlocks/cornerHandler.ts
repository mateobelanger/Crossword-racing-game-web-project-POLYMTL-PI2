import {Waypoint} from "../trackData/waypoint";
import * as THREE from "three";
import { Road } from "../../track-editor/constraints/road";

export const TRACK_LENGTH: number = 1;


export class CornerHandler {

    private _waypoints: Waypoint[];
    private _roads: Road[];

    public constructor(private scene: THREE.Scene, waypoints: Waypoint[]) {
        this._waypoints = [];
        this._roads = [];
    }

    private addRoads(waypoints: Waypoint[]): void {
        let previousRoad: Road = this._roads[this._roads.length - 1];
        for (let i: number = 0; i < waypoints.length - 1; i++) {
            const road: Road = new Road(waypoints[i].position, waypoints[i + 1].position,
                                        waypoints[i].getOutgoingPlaneId(), previousRoad);
            road.initialize();
            this._roads.push(road);
            previousRoad = road;
        }
    }

    private closeRoad(): void {
        this._roads[0].previousRoad = this._roads[this._roads.length - 1];
    }

    // private generateCorner(road: Road /*ou waypoint ? */): THREE.Geometry {
    //     road.getAngleBetweenRoads();

    //     return null;
    // }

    public generateCorners(): void {
        this.addRoads(this._waypoints);
        this.closeRoad();
        // for()
        this.scene.add();
    }

}
