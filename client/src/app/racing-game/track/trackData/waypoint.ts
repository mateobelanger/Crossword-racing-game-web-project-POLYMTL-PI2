import * as THREE from 'three';

export class Waypoint 
{
    private circleId:number = null;

    private planesId: number[] = [];

    constructor(
        private position: THREE.Vector3 = new THREE.Vector3(0,0,0),
    ){}

    public getPosition() : THREE.Vector3
    {
        return this.position;
    }

    public setPosition(position: THREE.Vector3)
    {
        this.position = position;
    }

    public bindCircle( id : number){
        if(this.circleId === null)
            this.circleId = id;
    }

    public getCircleId():number{
        return this.circleId;
    }
    
    public unbindCircle(){
        this.circleId = null;
    }

    public bindPlane(id : number){
        if((this.planesId.length < 2) && (this.planesId.indexOf(id) == -1))
            this.planesId.push(id);
    }

    public getPlanesIds(): number[]{
        return this.planesId;
    }

    public unbindPlane(idToremove : number){
        let index : number = this.planesId.indexOf(idToremove);
        if( index > -1)
            this.planesId.splice(index, 1);
    }
}