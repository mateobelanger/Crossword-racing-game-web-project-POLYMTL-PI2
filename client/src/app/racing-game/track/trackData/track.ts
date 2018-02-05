import {Waypoint} from './waypoint';

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

    public getWaypoint(circleId: number): Waypoint{
        const index: number = this.findWaypointIndex(circleId);
        if(index !== -1)
            return this.waypoints[index];
        return null;
    }

    public addWaypoint(wayPoint : Waypoint){
        this.waypoints.push(wayPoint);
    }

    public isFirstWaypoint(circleId: number): boolean {
        return this.findWaypointIndex(circleId) === 0;
    }

    public getFirstWaypoint(): Waypoint {
        return this.waypoints[0];
    }

    public removeWaypoint(): Waypoint {
        return this.waypoints.pop();
    }

    public getPreviousToLastWaypoint(): Waypoint {
        return this.waypoints[this.waypoints.length-2];
    }

    public getLastWaypoint(): Waypoint {
        return this.waypoints[this.waypoints.length-1];
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