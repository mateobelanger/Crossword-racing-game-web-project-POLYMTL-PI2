
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

    public removeWayPoint(dot : Vector3): Vector3[]{
        const index: number = this.findVector3Index(dot);
        if (index !== -1) 
            return this.wayPoints.splice(index, 1);
        else
            return undefined;

    }

    private findVector3Index(dot: Vector3): number {
        let index: number = -1;
        this.wayPoints.forEach((element, i) => {
            if((element.x === dot.x) && (element.y === dot.y) && (element.z === dot.z))
                index = i;
        });
        return index;
    }
}