
import {Vector3} from 'three';

export class Track 
{
    public constructor(private waypoints : Vector3[] = []){
    }

    public getWaypoints() : Vector3[]
    {
        return this.waypoints;
    }

    public addWaypoint(dot : Vector3) : void {
        this.waypoints.push(dot);
    }

    public removeWaypoint(dot : Vector3) : void {
        const index: number = this.waypoints.indexOf(dot);
        if (index !== -1) {
            this.waypoints.splice(index, 1);
        }
    }

    public removeLastWaypoint() : void {
        this.waypoints.pop()
    }
}