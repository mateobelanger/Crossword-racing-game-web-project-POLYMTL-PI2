
import {Vector3} from 'three';

export class Track 
{
    public constructor(private wayPoints : WayPoint[] = []){
    }

    public getWayPoints() : WayPoint[]{
        return this.wayPoints;
    }

    public getWaypoint(id: number): WayPoint{
        return this.wayPoints[this.findWayPointIndex(id)];
    }

    public addWayPoint(wayPoint : WayPoint){
        this.wayPoints.push(wayPoint);
    }

    public removeWayPoint(id : number){
        const index: number = this.findWayPointIndex(id);
        if (index !== -1) 
            this.wayPoints.splice(index, 1);
    }

    public modifyWayPointPosition(id: number, newPosition : Vector3){
        const index: number = this.findWayPointIndex(id);
        if(index !== -1)
            this.wayPoints[index].setPosition(newPosition);     
    }

    private findWayPointIndex(id : number): number {
        let index : number = -1;
        this.wayPoints.forEach((element, i) => {
            if(element.getId() === id)
                index = i;
        });
        return index;
    }
    
        public removeLastWaypoint() : void {
        this.waypoints.pop()
    }
}