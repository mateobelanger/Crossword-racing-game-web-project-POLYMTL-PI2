import * as THREE from 'three';

const MAX_BINDED_PLANES: number = 2;

export class Waypoint {

    private circleId: number = null;

    private planesId: number[] = []; // order of elements important

    public constructor(
        private position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
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

    public bindPlane(id: number): void {
        if ((this.planesId.length < MAX_BINDED_PLANES) && (this.planesId.indexOf(id) === -1))
            this.planesId.push(id);
    }

    public bindNoPlane(): void {
        this.planesId.unshift(null);
    }

    public getPlanesIds(): number[] {
        return this.planesId;
    }

    public unbindPlane(idToremove: number): void {
        const index: number = this.planesId.indexOf(idToremove);
        if ( index > -1)
            this.planesId.splice(index, 1);
    }
}
