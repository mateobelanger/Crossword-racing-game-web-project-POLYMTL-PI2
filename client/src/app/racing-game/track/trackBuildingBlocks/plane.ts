import {Waypoint} from "../trackData/waypoint";
import * as THREE from "three";


export class Plane {

    private beginPoint : THREE.Vector3;

    private endPoint : THREE.Vector3;

    constructor( private mesh: THREE.Mesh, waypoint1: Waypoint, waypoint2: Waypoint){
        this.beginPoint = waypoint1.getPosition();
        this.endPoint = waypoint2.getPosition();
    }

    public getId(): number{
        return this.mesh.id;
    }

    public getMesh(): THREE.Mesh{
        return this.mesh;
    }

    public getLength(): number{
        return this.endPoint.distanceTo(this.endPoint);
    }

    public setEndPoint(newPos : THREE.Vector3): THREE.Vector3{
        let oldEndPoint : THREE.Vector3 = this.endPoint;
        this.endPoint = newPos;
        return oldEndPoint;
    }

    public getEndPoint() : THREE.Vector3{
        return this.endPoint;
    }

    public setBeginingPoint(newPos : THREE.Vector3): THREE.Vector3{
        let oldBeginPoint : THREE.Vector3 = this.beginPoint;
        this.beginPoint = newPos;
        return oldBeginPoint;
    }

    public getBeginingPoint() : THREE.Vector3{
        return this.beginPoint;
    }
}