import { Waypoint } from "../trackData/waypoint";
import * as THREE from "three";

const EXPOSANT_CARRE: number = 2;
const DIVISEUR_MOYENNE: number = 2;
const CIRLEDIAMETER: number = 10;
const REFERENCE_VECTOR: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
const DEFAULT_WAYPOINT_VECTOR: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
const PLANE_POSITION_Z: number = -1;



export class Plane {

    private beginingPoint: THREE.Vector3;

    private endPoint: THREE.Vector3;

    private previousAngle: number;

    private mesh: THREE.Mesh;

    public constructor(waypoint1: Waypoint = new Waypoint(DEFAULT_WAYPOINT_VECTOR),
                       waypoint2: Waypoint = new Waypoint(DEFAULT_WAYPOINT_VECTOR)) {
        this.previousAngle = 0;
        waypoint1.setPositionZ(PLANE_POSITION_Z);
        waypoint2.setPositionZ(PLANE_POSITION_Z);
        this.beginingPoint = waypoint1.getPosition();
        this.endPoint = waypoint2.getPosition();
        this.mesh = null;
    }

    public setPreviousAngle(newAngle: number): void {
        this.previousAngle = newAngle;
    }

    public getPreviousAngle(): number {
        return this.previousAngle;
    }

    public calculateRadianAngle(): number {
        const directionVector: THREE.Vector3 = new THREE.Vector3();
        directionVector.subVectors(this.endPoint, this.beginingPoint);
        let angle: number = directionVector.angleTo(REFERENCE_VECTOR);
        if (directionVector.y < REFERENCE_VECTOR.y)
            angle *= -1;

        return angle;
    }

    public getId(): number {
        return this.mesh.id;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public setMesh(mesh: THREE.Mesh): void {
        this.mesh = mesh;
    }

    public getLength(): number {
        return Math.sqrt(Math.pow(this.beginingPoint.x - this.endPoint.x, EXPOSANT_CARRE)
                                + Math.pow(this.beginingPoint.y - this.endPoint.y, EXPOSANT_CARRE)
                                + Math.pow(this.beginingPoint.z - this.endPoint.z, EXPOSANT_CARRE))
                                - CIRLEDIAMETER;
    }

    public getCenterPoint(): THREE.Vector3 {
        const centerPoint: THREE.Vector3 = new THREE.Vector3((this.endPoint.x - this.beginingPoint.x) / DIVISEUR_MOYENNE,
                                                             (this.endPoint.y - this.beginingPoint.y) / DIVISEUR_MOYENNE,
                                                             (this.endPoint.z - this.beginingPoint.z) / DIVISEUR_MOYENNE
                                                    );

        return centerPoint.add(this.beginingPoint);
    }

    public setEndPoint(newPos: THREE.Vector3): THREE.Vector3 {
        const oldEndPoint: THREE.Vector3 = this.endPoint;
        this.endPoint = newPos;

        return oldEndPoint;
    }

    public getEndPoint(): THREE.Vector3 {
        return this.endPoint;
    }

    public setBeginingPoint(newPos: THREE.Vector3): THREE.Vector3 {
        const oldBeginPoint: THREE.Vector3 = this.beginingPoint;
        this.beginingPoint = newPos;

        return oldBeginPoint;
    }

    public getBeginingPoint(): THREE.Vector3 {
        return this.beginingPoint;
    }
}
