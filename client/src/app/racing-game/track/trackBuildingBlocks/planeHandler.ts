import {Waypoint} from "../trackData/waypoint";
import * as THREE from "three";
import {Plane} from "./plane";


const TRACKWIDTH = 20;

const TRACKLENGTH = 1;

const REFERENCEVECTOR = new THREE.Vector3(1,0,0);

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
            console.log(plane.getCenterPoint());
            console.log(plane.getId());
            console.log(plane.getRadianAngle());
        }

    }

    public removePlane(meshId : number){
        let index : number = this.findPlaneIndex(meshId);
        this.scene.remove(this.planes[index].getMesh());
        this.planes.splice(index, 1);
    }


    //TODO : resize the plane to make it reach both waypoint
    public moveWaypoint(planesId : number[], newPos: THREE.Vector3){//order of planeIds important!! 1st -> beginingPoint 2nd -> endPoint
        let planes : Plane[] = [];
        planesId.forEach((planeId, index)=> {
            if(planesId !== null)
                planes[index] = this.planes[this.findPlaneIndex(planeId)];
            else
                planes[index] = null;               
        });
        console.log(planes);
        if(planes[0] ! == null){
            let oldWayPoint : THREE.Vector3 = planes[0].setBeginingPoint(newPos);
            let angle : number = oldWayPoint.angleTo(planes[0].getBeginingPoint());
            this.rotateAroundWaypoint(planes[0], angle, true);
        }
        if(planes[1] ! == null){
            let oldWayPoint : THREE.Vector3 = planes[1].setEndPoint(newPos);
            let angle : number = oldWayPoint.angleTo(planes[1].getEndPoint());
            this.rotateAroundWaypoint(planes[1], angle, false);
        }
    }

    private findPlaneIndex(id : number): number{
        let index : number = null;
        this.planes.forEach((element, i) => {
            if(element.getId() === id)
                index = i;
        });
        return index;
    }

    //TODO: translate mesh
    private bindPlanes(planeId: number, waypoint1: Waypoint, waypoint2: Waypoint){
        let index : number = this.findPlaneIndex(planeId);
        waypoint1.bindPlane(this.planes[index].getId());
        waypoint2.bindPlane(this.planes[index].getId());

        let centerPoint : THREE.Vector3 = this.planes[index].getCenterPoint();
        this.translatePlane(planeId, centerPoint);
        this.orientPlane(this.planes[index]);
        this.resizePlane(this.planes[index]);

    }

    //TODO: find better name
    private orientPlane(plane : Plane){
        this.setPlaneRadianAngle(plane);
        plane.getMesh().rotateZ(-plane.getRadianAngle());
    }

    private setPlaneRadianAngle(plane: Plane){
        let directionVector : THREE.Vector3 = new THREE.Vector3();
        directionVector.subVectors(plane.getEndPoint(), plane.getBeginingPoint());
        plane.setRadianAngle(directionVector.angleTo(REFERENCEVECTOR));
    }

    private rotateAroundWaypoint(plane: Plane, absoluteRandianAngle: number, aroundFirstWaypoint: boolean){
        let translation : number = plane.getLength()/2;
        if(aroundFirstWaypoint)
            translation *= -1;

        plane.getMesh().translateX(-translation);
        plane.getMesh().rotateZ(plane.getRadianAngle() - absoluteRandianAngle);
        plane.setRadianAngle(absoluteRandianAngle);
        plane.getMesh().translateX(translation);
    }

    private resizePlane(plane : Plane){
        if(plane.getLength() === 0)
            return;
        plane.getMesh().scale.x = plane.getLength();
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

    private translatePlane(planeId: number , absolutePosition : THREE.Vector3){
        let index : number = this.findPlaneIndex(planeId);

        let relativeMovement : THREE.Vector3 = new THREE.Vector3();
        relativeMovement.subVectors(absolutePosition, this.planes[index].getMesh().position);

        this.planes[index].getMesh().translateX(absolutePosition.x);
        this.planes[index].getMesh().translateY(absolutePosition.y);
        this.planes[index].getMesh().translateZ(absolutePosition.z);
    }
}
