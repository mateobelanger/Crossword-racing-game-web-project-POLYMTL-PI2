import {Waypoint} from "../trackData/waypoint";
import * as THREE from "three";
import { Vector3 } from "three";

const CIRLEDIAMETER = 10;

const REFERENCEVECTOR = new THREE.Vector3(1,0,0);


export class Plane {

    private beginPoint : THREE.Vector3;

    private endPoint : THREE.Vector3;

    private previousAngle : number = 0;

    constructor( private mesh: THREE.Mesh, waypoint1: Waypoint, waypoint2: Waypoint){
        this.beginPoint = waypoint1.getPosition();
        this.endPoint = waypoint2.getPosition();
    }

    public setPreviousAngle(newAngle : number){
        this.previousAngle = newAngle;
    }

    public getPreviousAngle(){
        return this.previousAngle;
    }

    public calculateRadianAngle(): number{
        let directionVector : THREE.Vector3 = new THREE.Vector3();
        directionVector.subVectors(this.endPoint, this.beginPoint);
        let angle : number = directionVector.angleTo(REFERENCEVECTOR);
        if((directionVector.y < REFERENCEVECTOR.y) && (this.beginPoint.y > this.endPoint.y))
            angle *= -1;
        return angle; 
    }

    public getId(): number{
        return this.mesh.id;
    }

    public getMesh(): THREE.Mesh{
        return this.mesh;
    }

    public getLength(): number{
        return Math.sqrt(Math.pow(this.beginPoint.x-this.endPoint.x, 2) +  Math.pow(this.beginPoint.y-this.endPoint.y, 2) + Math.pow(this.beginPoint.z-this.endPoint.z, 2)) - CIRLEDIAMETER;
    }

    public getCenterPoint(): THREE.Vector3{
        let centerPoint : THREE.Vector3 = new Vector3((this.endPoint.x-this.beginPoint.x)/2, (this.endPoint.y-this.beginPoint.y)/2, (this.endPoint.z-this.beginPoint.z)/2);
        return centerPoint.add(this.beginPoint);
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