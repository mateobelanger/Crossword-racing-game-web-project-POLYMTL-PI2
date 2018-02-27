import { Waypoint } from "../trackData/waypoint";
import { PLANE_POSITION_Z } from '../../constants';
import * as THREE from "three";

const EXPOSANT_CARRE: number = 2;
const DIVISEUR_MOYENNE: number = 2;
const PIVOT_POINT_SHIFT: number = 10;
const REFERENCE_VECTOR: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
const DEFAULT_WAYPOINT_VECTOR: THREE.Vector3 = new THREE.Vector3(0, 0, 0);


export class Plane {

    private _beginingPoint: THREE.Vector3;
    private _endPoint: THREE.Vector3;
    private _previousAngle: number;
    private _mesh: THREE.Mesh;

    public constructor(waypoint1: Waypoint = new Waypoint(DEFAULT_WAYPOINT_VECTOR),
                       waypoint2: Waypoint = new Waypoint(DEFAULT_WAYPOINT_VECTOR)) {
        this._previousAngle = 0;
        waypoint1.setPositionZ(PLANE_POSITION_Z);
        waypoint2.setPositionZ(PLANE_POSITION_Z);
        this._beginingPoint = waypoint1.position;
        this._endPoint = waypoint2.position;
        this._mesh = null;
    }

    public set previousAngle(newAngle: number) {
        this._previousAngle = newAngle;
    }

    public get previousAngle(): number {
        return this._previousAngle;
    }

    public get id(): number {
        return this._mesh.id;
    }

    public get mesh(): THREE.Mesh {
        return this._mesh;
    }

    public set mesh(_mesh: THREE.Mesh) {
        this._mesh = _mesh;
    }

    public get centerPoint(): THREE.Vector3 {
        const centerPoint: THREE.Vector3 = new THREE.Vector3((this._endPoint.x - this._beginingPoint.x) / DIVISEUR_MOYENNE,
                                                             (this._endPoint.y - this._beginingPoint.y) / DIVISEUR_MOYENNE,
                                                             (this._endPoint.z - this._beginingPoint.z) / DIVISEUR_MOYENNE
                                                    );

        return centerPoint.add(this._beginingPoint);
    }

    public set beginingPoint(newPos: THREE.Vector3) {
        this._beginingPoint = newPos;
    }

    public get beginingPoint(): THREE.Vector3 {
        return this._beginingPoint;
    }

    public set endPoint(newPos: THREE.Vector3) {
        this._endPoint = newPos;
    }

    public get endPoint(): THREE.Vector3 {
        return this._endPoint;
    }

    public get length(): number {
        return Math.sqrt(Math.pow(this._beginingPoint.x - this._endPoint.x, EXPOSANT_CARRE)
                                + Math.pow(this._beginingPoint.y - this._endPoint.y, EXPOSANT_CARRE)
                                + Math.pow(this._beginingPoint.z - this._endPoint.z, EXPOSANT_CARRE))
                                - PIVOT_POINT_SHIFT;
    }

    public calculateRadianAngle(): number {
        const directionVector: THREE.Vector3 = new THREE.Vector3();
        directionVector.subVectors(this._endPoint, this._beginingPoint);
        let angle: number = directionVector.angleTo(REFERENCE_VECTOR);
        if (directionVector.y < REFERENCE_VECTOR.y)
            angle *= -1;

        return angle;
    }
}
