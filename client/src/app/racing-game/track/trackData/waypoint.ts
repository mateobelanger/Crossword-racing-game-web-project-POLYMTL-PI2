
import * as THREE from 'three';

export class Waypoint 
{
    private circle: THREE.Mesh;

    private planes: THREE.Mesh[];

    constructor(
        private position: THREE.Vector3 = new THREE.Vector3(0,0,0),
        private id: number = -1 //probablement bientot une archive
    ){}

    public getPosition() : THREE.Vector3
    {
        return this.position;
    }

    public setPosition(position: THREE.Vector3)
    {
        this.position = position;
    }

    public getId(): number
    {
        return this.id;
    }

    public setId(newId : number){
        this.id = newId;
    }

    public bindCircle( object : THREE.Mesh){
        this.circle = object;
    }

    public getCircle():THREE.Mesh{
        return this.circle;
    }
    
    public unBindCircle(){
        this.circle = null;
    }

    public bindPlane(object : THREE.Mesh){
        if(this.planes.length < 2)
            this.planes.push(object);
    }
}