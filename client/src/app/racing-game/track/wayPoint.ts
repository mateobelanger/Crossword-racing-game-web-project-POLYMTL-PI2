
import {Vector3} from 'three';

export class Waypoint 
{
    constructor(
        private position: Vector3 = new Vector3(0,0,0),
        private id: number = -1
    ){}

    public getPosition() : Vector3
    {
        return this.position;
    }

    public setPosition(position: Vector3)
    {
        this.position = position;
    }

    public getId(): number
    {
        return this.id;
    }
}