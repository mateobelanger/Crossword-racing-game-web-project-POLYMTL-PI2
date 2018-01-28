
import {Vector3} from 'three';

export class Track 
{
    public constructor(private wayPoints : Vector3[] = []){
    }

    public getWayPoints() : Vector3[]
    {
        return this.wayPoints;
    }

    public addWayPoint(dot : Vector3){
        this.wayPoints.push(dot);
    }

    public removeWayPoint(dot : Vector3){
        const index: number = this.wayPoints.indexOf(dot);
        if (index !== -1) {
            this.wayPoints.splice(index, 1);
    }
    }
}