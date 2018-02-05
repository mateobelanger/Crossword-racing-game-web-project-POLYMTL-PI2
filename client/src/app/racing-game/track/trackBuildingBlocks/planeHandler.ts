import {Waypoint} from "../trackData/waypoint";
import {Plane} from "./plane";
import * as THREE from "three";

const TRACKWIDTH: number = 20;

const TRACKLENGTH: number = 1;

const RATIO_IMAGE_PER_PLANE_LENGTH: number = 90;


export class PlaneHandler {


    private planes: Plane[] = [];

    public constructor(private scene: THREE.Scene) {
    }

    public generatePlanes(waypoints: Waypoint[]): void {
        const geometries: THREE.PlaneGeometry[] = this.generatePlaneGeometry(waypoints.length);

        for ( let i: number = 0; i < waypoints.length - 1; i++) {
            const plane: Plane = new Plane(waypoints[i], waypoints[i + 1]);
            const material: THREE.MeshBasicMaterial = this.getPlaneMaterial(plane.getLength());
            const mesh: THREE.Mesh = new THREE.Mesh(geometries[i], material);
            plane.setMesh(mesh);
            this.planes.push(plane);
            this.scene.add(plane.getMesh());
            this.bindPlanes(plane.getId(), waypoints[i], waypoints[i + 1]);
        }

    }

    public removePlane(meshId: number): void {
        const index: number = this.findPlaneIndex(meshId);
        this.scene.remove(this.planes[index].getMesh());
        this.planes.splice(index, 1);
    }


    // order of planeIds important!! 1st -> endPoint  2nd -> beginingPoint
    public movedWaypoint(waypoint: Waypoint, newPos: THREE.Vector3): void {
        let firstPlaneId: number, secondPlaneId: number;
        [firstPlaneId, secondPlaneId] = waypoint.getPlanesIds();

        if (firstPlaneId !== null && firstPlaneId !== undefined) {
            const firstPlane: Plane = this.planes[this.findPlaneIndex(firstPlaneId)];
            firstPlane.setEndPoint(waypoint.getPosition());
            this.connectPlaneWithWaypoint(firstPlane.getId());
        }
        if (secondPlaneId !== null && secondPlaneId !== undefined) {
            const secondPlane: Plane = this.planes[this.findPlaneIndex(secondPlaneId)];
            secondPlane.setBeginingPoint(waypoint.getPosition());
            this.connectPlaneWithWaypoint(secondPlane.getId());
        }
    }

    private connectPlaneWithWaypoint(planeId: number): void {
        const plane: Plane = this.planes[this.findPlaneIndex(planeId)];
        const centerPoint: THREE.Vector3 = plane.getCenterPoint();
        this.translatePlane(planeId, centerPoint);
        this.orientPlaneWithWaypoint(plane);
        this.resizePlane(plane);
    }

    private findPlaneIndex(id: number): number {
        let index: number = null;
        this.planes.forEach((element, i) => {
            if (element.getId() === id)
                index = i;
        });

        return index;
    }

    private bindPlanes(planeId: number, waypoint1: Waypoint, waypoint2: Waypoint): void {
        const plane: Plane = this.planes[this.findPlaneIndex(planeId)];
        waypoint1.bindPlane(plane.getId());
        waypoint2.bindPlane(plane.getId());

        this.connectPlaneWithWaypoint(planeId);

    }

    private orientPlaneWithWaypoint(plane: Plane): void {
        this.orientPlaneWithReferenceVector(plane);
        plane.getMesh().rotateZ(plane.calculateRadianAngle());
        plane.setPreviousAngle(plane.calculateRadianAngle());
    }

    private orientPlaneWithReferenceVector(plane: Plane): void {
        plane.getMesh().rotateZ(-plane.getPreviousAngle());
    }

    private unOrientPlaneWithReferenceVector(plane: Plane): void {
        plane.getMesh().rotateZ(plane.getPreviousAngle());
    }

    private resizePlane(plane: Plane): void {
        if (plane.getLength() === 0)
            return;
        plane.getMesh().scale.x = plane.getLength();
    }

    private translatePlane (planeId: number , absolutePosition: THREE.Vector3): void {
        const plane: Plane = this.planes[this.findPlaneIndex(planeId)];
        const relativeMovement: THREE.Vector3 = new THREE.Vector3();
        relativeMovement.subVectors(absolutePosition, plane.getMesh().position);
        this.orientPlaneWithReferenceVector(plane);
        plane.getMesh().translateX(relativeMovement.x);
        plane.getMesh().translateY(relativeMovement.y);
        plane.getMesh().translateZ(relativeMovement.z);
        this.unOrientPlaneWithReferenceVector(plane);
    }

    private generatePlaneGeometry(nPlanes: number): THREE.PlaneGeometry[] {
        const planeGeometries: THREE.PlaneGeometry[] = [];
        for (let i: number = 0 ; i < nPlanes; i++)
            planeGeometries.push(new THREE.PlaneGeometry(TRACKLENGTH, TRACKWIDTH));

        return planeGeometries;
    }


    private getPlaneMaterial(planeLenght: number): THREE.MeshBasicMaterial {
        let createTexture: THREE.Texture = new THREE.Texture;
        createTexture = new THREE.TextureLoader().load("../../../../assets/road/road_texture.png");
        createTexture.wrapS = THREE.RepeatWrapping;
        createTexture.wrapT = THREE.RepeatWrapping;
        createTexture.repeat.set( planeLenght / RATIO_IMAGE_PER_PLANE_LENGTH, 1);

        return new THREE.MeshBasicMaterial({ map: createTexture, side: THREE.DoubleSide});
    }
}
