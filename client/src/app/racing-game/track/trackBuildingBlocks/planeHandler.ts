import {Waypoint} from "../trackData/waypoint";
import {Plane} from "./plane";
import { UPPER_PLANE_POSITION_Z, TRACK_WIDTH, PlaneType, LOWER_PLANE_POSITION_Z } from '../../constants';
import * as THREE from "three";

const RATIO_IMAGE_PER_PLANE_LENGTH: number = 40;
const RATIO_IMAGE_PER_FIRST_PLANE_LENGTH: number = 40;
const ASSETS_FOLDER: string = "../../../../assets/track_editor_texture/";
const ASSETS_NAME: string[] = ["first_road_texture-v2.jpg", "first_road_texture-v2_red.jpg",
                               "road_texture-v2.jpg", "road_texture-v2_red.jpg"];

export const TRACK_LENGTH: number = 1;
const EVEN_NUMBER: number = 2;

export class PlaneHandler {


    private _planes: Plane[];
    private _firstPlaneId: number;

    public constructor(private scene: THREE.Scene) {
        this._planes = [];
        this._firstPlaneId = undefined;
    }

    public generatePlanes(waypoints: Waypoint[], hasReversedAxes: boolean): void {
        const axis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);

        const geometries: THREE.PlaneGeometry[] = this.generatePlaneGeometry(waypoints.length);

        for ( let i: number = 0; i < waypoints.length - 1; i++) {
            const plane: Plane = new Plane(waypoints[i], waypoints[i + 1]);
            const material: THREE.MeshBasicMaterial = this.getPlaneMaterial(plane.length, PlaneType.VALID_PLANE);
            const mesh: THREE.Mesh = new THREE.Mesh( geometries[i], this._planes.length === 0 ?
                                                    this.getPlaneMaterial(plane.length, PlaneType.VALID_FIRST_PLANE) :
                                                    material );
            plane.mesh = (mesh);
            if (this._planes.length === 0) {
                this._firstPlaneId = mesh.id;
            }
            this._planes.push(plane);

            plane.mesh.position.z = i % EVEN_NUMBER === 0 ? UPPER_PLANE_POSITION_Z : LOWER_PLANE_POSITION_Z;

            hasReversedAxes ? plane.mesh.rotateOnAxis(axis, Math.PI / 2) : plane.mesh.rotateOnAxis(axis, 0);

            this.scene.add(plane.mesh);
            this.bindPlanes(plane.id, waypoints[i], waypoints[i + 1]);
        }
    }

    public removePlane(meshId: number): void {
        const index: number = this.findPlaneIndex(meshId);
        this.scene.remove(this._planes[index].mesh);
        this._planes.splice(index, 1);
    }

    public movedWaypoint(waypoint: Waypoint, newPos: THREE.Vector3): void {
        newPos.z = UPPER_PLANE_POSITION_Z;
        const firstPlane: Plane = this.getPlane(waypoint.getIncomingPlaneId());
        const secondPlane: Plane = this.getPlane(waypoint.getOutgoingPlaneId());

        if (this.isDefined(firstPlane)) {
            firstPlane.endPoint = waypoint.position;
            this.connectPlaneWithWaypoint(firstPlane.id);
        }
        if (this.isDefined(secondPlane)) {
            secondPlane.beginingPoint = waypoint.position;
            this.connectPlaneWithWaypoint(secondPlane.id);
        }
    }

    public get planes(): Plane[] {
        return this._planes;
    }

    public applyInvalidTexture(planeId: number): void {
        const planeType: PlaneType = planeId === this._firstPlaneId ? PlaneType.INVALID_FIRST_PLANE : PlaneType.INVALID_PLANE;
        const plane: Plane = this.getPlane(planeId);

        if (this.isDefined(plane)) {
            plane.mesh.material = this.getPlaneMaterial(plane.length, planeType);
        }
    }

    public applyValidTexture(planeId: number): void {
        const planeType: PlaneType = planeId === this._firstPlaneId ? PlaneType.VALID_FIRST_PLANE : PlaneType.VALID_PLANE;
        const plane: Plane = this.getPlane(planeId);

        if (this.isDefined(plane)) {
            plane.mesh.material = this.getPlaneMaterial(plane.length, planeType);
        }
    }

    private connectPlaneWithWaypoint(planeId: number): void {
        const plane: Plane = this.getPlane(planeId);
        const centerPoint: THREE.Vector3 = plane.centerPoint;
        this.translatePlane(planeId, centerPoint);
        this.orientPlaneWithWaypoint(plane);
        this.resizePlane(plane);
    }

    private findPlaneIndex(id: number): number {
        let index: number = null;
        this._planes.forEach((element, i) => {
            if (element.id === id)
                index = i;
        });

        return index;
    }

    private getPlane(id: number): Plane {
        let plane: Plane = null;
        if (this.isDefined(id))
            plane = this._planes[this.findPlaneIndex(id)];

        return plane;
    }

    private bindPlanes(planeId: number, waypoint1: Waypoint, waypoint2: Waypoint): void {
        const plane: Plane = this.getPlane(planeId);
        waypoint1.bindOutgoingPlane(plane.id);
        waypoint2.bindIncomingPlane(plane.id);

        this.connectPlaneWithWaypoint(planeId);

    }

    private orientPlaneWithWaypoint(plane: Plane): void {
        this.orientPlaneWithReferenceVector(plane);
        plane.mesh.rotateZ(plane.calculateRadianAngle());
        plane.previousAngle = plane.calculateRadianAngle();
    }

    private orientPlaneWithReferenceVector(plane: Plane): void {
        plane.mesh.rotateZ(-plane.previousAngle);
    }

    private unOrientPlaneWithReferenceVector(plane: Plane): void {
        plane.mesh.rotateZ(plane.previousAngle);
    }

    private resizePlane(plane: Plane): void {
        if (plane.length === 0)
            return;
        plane.mesh.scale.x = plane.length;
    }

    private translatePlane (planeId: number , absolutePosition: THREE.Vector3): void {
        const plane: Plane = this.getPlane(planeId);
        const relativeMovement: THREE.Vector3 = new THREE.Vector3();
        relativeMovement.subVectors(absolutePosition, plane.mesh.position);
        this.orientPlaneWithReferenceVector(plane);
        plane.mesh.translateX(relativeMovement.x);
        plane.mesh.translateY(relativeMovement.y);
        plane.mesh.translateZ(relativeMovement.z);
        this.unOrientPlaneWithReferenceVector(plane);
    }

    private generatePlaneGeometry(nPlanes: number): THREE.PlaneGeometry[] {
        const planeGeometries: THREE.PlaneGeometry[] = [];
        for (let i: number = 0 ; i < nPlanes; i++)
            planeGeometries.push(new THREE.PlaneGeometry(TRACK_LENGTH, TRACK_WIDTH));

        return planeGeometries;
    }


    private getPlaneMaterial(planeLength: number, planeType: PlaneType): THREE.MeshBasicMaterial {
        const createTexture: THREE.Texture = new THREE.TextureLoader().load(ASSETS_FOLDER + ASSETS_NAME[planeType]);
        createTexture.wrapS = THREE.RepeatWrapping;
        createTexture.wrapT = THREE.RepeatWrapping;
        const ratio: number = planeType <= PlaneType.INVALID_FIRST_PLANE ?
                                                            RATIO_IMAGE_PER_FIRST_PLANE_LENGTH : RATIO_IMAGE_PER_PLANE_LENGTH;
        createTexture.repeat.set( planeLength / ratio, 1);

        return new THREE.MeshBasicMaterial({ map: createTexture, side: THREE.DoubleSide});
    }

    // tslint:disable:no-any
    private isDefined(object: any): boolean {
        return ((object !== null) && (object !== undefined));
    }// tslint:enable:no-any
}
