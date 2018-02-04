import {Waypoint} from './waypoint';
import * as THREE from 'three';
/*tslint:disable:all*/
export class Track 
{
    public constructor(private waypoints : Waypoint[] = []){
    }

    public getWaypoints() : Waypoint[] {
        return this.waypoints;
    }

    public getWaypointsSize() : number {
        return this.waypoints.length;
    }

    public getWaypoint(CircleId: number): Waypoint{
        const index: number = this.findWaypointIndex(CircleId);
        if(index !== -1)
            return this.waypoints[index];
        return null;
    }

    public addWaypoint(wayPoint : Waypoint){
        this.waypoints.push(wayPoint);
    }

    public addWayPointWithMouse (position: THREE.Vector3): Waypoint {
        let wayPointTemp = new Waypoint();
        wayPointTemp.setPosition(position);
        this.waypoints.push(wayPointTemp);
        return wayPointTemp;
    }

    public removeWaypoint(): Waypoint {
        return this.waypoints.pop();
    }

    public getPreviousWaypoint(): Waypoint {
        return this.waypoints[this.waypoints.length-2];
    }

    private findWaypointIndex(id : number): number {
        let index : number = -1;
        this.waypoints.forEach((element, i) => {
            if(element.getCircleId() === id)
                index = i;
        });
        return index;
    }
}