import * as THREE from 'three';

//const MAX_BINDED_PLANES: number = 2;

export class Waypoint {

    private circleId: number = null;

    private incomingPlaneId: number = null;

    private outgoingPlaneId: number = null;

    //a enelever
    //private planesId: number[] = []; // order of elements important

    public constructor(
        private position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
    ) {}

    public getPosition(): THREE.Vector3 {
        return this.position;
    }

    public setPosition(position: THREE.Vector3): void {
        this.position = position;
    }

    public setPositionZ(positionZ: number): void {
        this.position.z = positionZ;
    }

    public bindCircle( id: number): void {
        if (this.circleId === null)
            this.circleId = id;
    }

    public getCircleId(): number {
        return this.circleId;
    }

    public unbindCircle(): void {
        this.circleId = null;
    }

    public bindIncomingPlane(id: number): void {
        if (this.incomingPlaneId === null)
        this.incomingPlaneId = id;
    }

    public unbindIncomingPlane(): void {
        this.incomingPlaneId = null;
    }

    public getIncomingPlaneId(): number {
        return this.incomingPlaneId;
    }

    public bindOutgoingPlane(id: number): void {
        if (this.outgoingPlaneId === null)
        this.outgoingPlaneId = id;
    }

    public unbindOutgoingPlane(): void {
        this.outgoingPlaneId = null;
    }

    public getOutgoingPlaneId(): number {
        return this.outgoingPlaneId;
    }

    //a changer
   /* public bindPlane(id: number): void {
        if ((this.planesId.length < MAX_BINDED_PLANES) && (this.planesId.indexOf(id) === -1))
            this.planesId.push(id);
    }*/

    //a decaliss
    /*public bindNoPlane(): void {
        this.planesId.unshift(null);
    }*/

    /*public getPlanesIds(): number[] {
        return this.planesId;
    }*/
}
