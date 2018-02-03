import {Waypoint} from "../trackData/waypoint";
import * as THREE from "three";
import {Plane} from "./plane";


const TRACKWIDTH = 20;

const TRACKLENGTH = 1;


export class PlaneHandler {


    private planes : Plane[] = [];

    constructor(private scene: THREE.Scene){
    }

    public generatePlanes(waypoints : Waypoint[]){
        let geometries : THREE.PlaneGeometry[] = this.generatePlaneGeometry(waypoints.length);
        let material : THREE.MeshBasicMaterial = this.getPlaneMaterial();
        
        for( let i = 0; i < waypoints.length-1; i++){
            let plane: Plane = new Plane(new THREE.Mesh(geometries[i], material), waypoints[i], waypoints[i+1]);
            this.planes.push(plane);
            this.scene.add(plane.getMesh());
            this.bindPlanes(plane.getId(), waypoints[i], waypoints[i+1]);
        }

    }

    public removePlane(meshId : number){
        let index : number = this.findPlaneIndex(meshId);
        this.scene.remove(this.planes[index].getMesh());
        this.planes.splice(index, 1);
    }


    //TODO : resize the plane to make it reach both waypoint
    public movedWaypoint(waypoint : Waypoint, newPos: THREE.Vector3){//order of planeIds important!! 1st -> beginingPoint 2nd -> endPoint
        
        /*
        if(planes[0] ! == null){
            let oldWayPoint : THREE.Vector3 = planes[0].setBeginingPoint(newPos);
            let angle : number = oldWayPoint.angleTo(planes[0].getBeginingPoint());
            this.rotateAroundWaypoint(planes[0], angle, true);
        }
        if(planes[1] ! == null){
            let oldWayPoint : THREE.Vector3 = planes[1].setEndPoint(newPos);
            let angle : number = oldWayPoint.angleTo(planes[1].getEndPoint());
            this.rotateAroundWaypoint(planes[1], angle, false);
        }*/
    }

    private connectPlaneWithWaypoint(planeId: number){
        let plane : Plane = this.planes[this.findPlaneIndex(planeId)];
        let centerPoint : THREE.Vector3 = plane.getCenterPoint();
        this.translatePlane(planeId, centerPoint);
        this.orientPlaneWithWaypoint(plane);
        this.resizePlane(plane);
    }

    private findPlaneIndex(id : number): number{
        let index : number = null;
        this.planes.forEach((element, i) => {
            if(element.getId() === id)
                index = i;
        });
        return index;
    }

    private bindPlanes(planeId: number, waypoint1: Waypoint, waypoint2: Waypoint){
        let plane : Plane = this.planes[this.findPlaneIndex(planeId)];
        waypoint1.bindPlane(plane.getId());
        waypoint2.bindPlane(plane.getId());

        this.connectPlaneWithWaypoint(planeId);

    }

    //TODO: find better name
    private orientPlaneWithWaypoint(plane : Plane){
        this.orientPlaneWithReferenceVector(plane);
        plane.getMesh().rotateZ(-plane.calculateRadianAngle());
        plane.setPreviousAngle(plane.calculateRadianAngle());
    }

    private orientPlaneWithReferenceVector(plane : Plane){
        plane.getMesh().rotateZ(plane.getPreviousAngle());
    }

    private unOrientPlaneWithReferenceVector(plane : Plane){
        plane.getMesh().rotateZ(-plane.getPreviousAngle());
    }

    private resizePlane(plane : Plane){
        if(plane.getLength() === 0)
            return;
        plane.getMesh().scale.x = plane.getLength();
    }

    private translatePlane(planeId: number , absolutePosition : THREE.Vector3){
        let plane : Plane = this.planes[this.findPlaneIndex(planeId)]
        let relativeMovement : THREE.Vector3 = new THREE.Vector3();
        relativeMovement.subVectors(absolutePosition, plane.getMesh().position);
        
        this.orientPlaneWithReferenceVector(plane);
        plane.getMesh().translateX(absolutePosition.x);
        plane.getMesh().translateY(absolutePosition.y);
        plane.getMesh().translateZ(absolutePosition.z);
        this.unOrientPlaneWithReferenceVector(plane);
    }

    private generatePlaneGeometry(nPlanes : number) : THREE.PlaneGeometry[]{
        let planeGeometries : THREE.PlaneGeometry[] = [];
        for(let i = 0 ; i < nPlanes; i++)
            planeGeometries.push(new THREE.PlaneGeometry(TRACKLENGTH,TRACKWIDTH));
        return planeGeometries;
    }
    

    private getPlaneMaterial(): THREE.MeshBasicMaterial{
        return new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide} ); 
    }
}
