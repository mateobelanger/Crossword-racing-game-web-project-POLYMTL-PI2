
import {Vector3} from 'three';

export class Track 
{
    public constructor(private waypoints : Vector3[] = []){
    }

    public getWaypoints() : Vector3[]{
        return this.waypoints;
    }

    public getWaypoint(index: number): Vector3{
        return this.waypoints[index];
    }

    public addWaypoint(wayPoint : Vector3){
        this.waypoints.push(wayPoint);
    }

    public modifyWaypointPosition(index: number, newPosition : Vector3){
            this.waypoints[index] = newPosition;
    }
    
    public removeLastWaypoint() {
        this.waypoints.pop()
    }
}