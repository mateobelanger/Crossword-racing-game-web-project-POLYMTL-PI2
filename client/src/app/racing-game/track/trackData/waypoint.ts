import * as THREE from 'three';

export class Waypoint {

    private circleId: number = null;

    private incomingPlaneId: number = null;

    private outgoingPlaneId: number = null;

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
}
