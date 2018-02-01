import {Waypoint} from './waypoint';

export class Track 
{
    public constructor(private waypoints : Waypoint[] = []){
    }

    public getWaypoints() : Waypoint[]{
        return this.waypoints;
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

    public removeWaypoint() : Waypoint {
        return this.waypoints.pop()
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