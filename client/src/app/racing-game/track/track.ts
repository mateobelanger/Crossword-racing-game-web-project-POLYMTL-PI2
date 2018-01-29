
import {Vector3} from 'three';
import {Waypoint} from './waypoint';

export class Track 
{
    public constructor(private waypoints : Waypoint[] = []){
    }

    public getWaypoints() : Waypoint[]{
        return this.waypoints;
    }

    public getWaypoint(id: number): Waypoint{
        return this.waypoints[this.findWaypointIndex(id)];
    }

    public addWaypoint(wayPoint : Waypoint){
        this.waypoints.push(wayPoint);
    }

    public removeWaypoint(id : number){
        const index: number = this.findWaypointIndex(id);
        if (index !== -1) 
            this.waypoints.splice(index, 1);
    }

    public modifyWaypointPosition(id: number, newPosition : Vector3){
        const index: number = this.findWaypointIndex(id);
        if(index !== -1)
            this.waypoints[index].setPosition(newPosition);     
    }

    private findWaypointIndex(id : number): number {
        let index : number = -1;
        this.waypoints.forEach((element, i) => {
            if(element.getId() === id)
                index = i;
        });
        return index;
    }
    
        public removeLastWaypoint() : void {
        this.waypoints.pop()
    }
}