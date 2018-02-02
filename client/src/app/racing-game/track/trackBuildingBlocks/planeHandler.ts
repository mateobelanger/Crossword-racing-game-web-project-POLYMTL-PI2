import {Waypoint} from "../trackData/waypoint";
import * as THREE from "three";
import {Plane} from "./plane";


const trackWidth = 20;

const trackLength = 1;

export class PlaneHandler {


    private planes : Plane[] = [];

    constructor(private scene: THREE.Scene){
    }

    public generatePlanes(waypoints : Waypoint[]){
        let geometries : THREE.PlaneGeometry[] = this.generatePlaneGeometry(waypoints.length);
        let material : THREE.MeshBasicMaterial = this.getPlaneMaterial();
        
        for( let i = 0; i < waypoints.length-1; i++)
        {
            let plane: Plane = new Plane(new THREE.Mesh(geometries[i], material), waypoints[i], waypoints[i+1]);
            this.planes.push(plane);
            this.scene.add(plane.getMesh());
            this.bindPlanes(plane, waypoints[i], waypoints[i+1]);
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
        this.planes.forEach((element, i)=> {
            if(element.getId() === id)
                index = i;
        });
        return index;
    }

    //TODO: translate mesh
    private bindPlanes(plane: Plane, waypoint1: Waypoint, waypoint2: Waypoint){
        waypoint1.bindPlane(plane.getId());
        waypoint2.bindPlane(plane.getId());
        //mesh.translateX(waypoint.getPosition().x);
        //mesh.translateY(waypoint.getPosition().y);
        //mesh.translateZ(waypoint.getPosition().z);
    }

    private rotateAroundWaypoint(plane: Plane, randianAngle: number, aroundFirstWaypoint: boolean){
        let translation : number = plane.getLength()/2;
        if(aroundFirstWaypoint)
            translation *= -1;

        plane.getMesh().translateY(-translation);
        plane.getMesh().rotateZ(randianAngle);
        plane.getMesh().translateY(translation);
    }

    private resizePlane(plane : Plane, length : number){
        plane.getMesh().scale.y = length;
    }

    private generatePlaneGeometry(nPlanes : number) : THREE.PlaneGeometry[]{
        let planeGeometries : THREE.PlaneGeometry[] = [];
        for(let i = 0 ; i < nPlanes; i++)
            planeGeometries.push(new THREE.PlaneGeometry(trackWidth, trackLength));
        return planeGeometries;
    }
    

    private getPlaneMaterial(): THREE.MeshBasicMaterial{
        return new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide} ); 
    }
}
