import {Waypoint} from "../trackData/waypoint";
import * as THREE from "three";

export class CircleHandler {
    
    private circleGeometry : THREE.Geometry[];

    private material : THREE.MeshBasicMaterial;

    private meshs : THREE.Mesh[] = [];

    constructor(private scene: THREE.Scene){
    }

    public generateCircles(waypoints : Waypoint[]){
        this.circleGeometry = this.generateCircleGeometry(waypoints.length);
        this.material = this.getCircleMaterial();
        this.circleGeometry.forEach((element,index) => {
            let mesh = new THREE.Mesh( element, this.material )
            this.meshs.push(mesh);
            this.scene.add(mesh);
            this.bindMesh(mesh, waypoints[index]);
        });
      }

    public removeCircle(meshId : number){
        let meshToRemove : THREE.Mesh = this.findMesh(meshId);
        this.scene.remove(meshToRemove);
        let index : number = this.meshs.indexOf(meshToRemove);//no need to verify !=-1
        this.meshs.splice(index, 1);
    }

    public moveCircle(id : number, newPosition : THREE.Vector3){
        let mesh : THREE.Mesh = this.findMesh(id);
        let relativeMovement : THREE.Vector3 = newPosition.sub(mesh.position);
        mesh.translateX(relativeMovement.x);
        mesh.translateY(relativeMovement.y);
        mesh.translateZ(relativeMovement.z);
    }

    private findMesh(id : number): THREE.Mesh{
        let mesh : THREE.Mesh = null;
        this.meshs.forEach((element)=> {
            if(element.id === id)
            mesh = element;
        });
        return mesh;
    }

    private bindMesh(mesh: THREE.Mesh, waypoint : Waypoint){
        waypoint.unbindCircle();
        waypoint.bindCircle(mesh.id);
        mesh.translateX(waypoint.getPosition().x);
        mesh.translateY(waypoint.getPosition().y);
        mesh.translateZ(waypoint.getPosition().z);
    }

    private generateCircleGeometry(nCircles : number): THREE.Geometry[]{
        let circleGeometrys : THREE.Geometry[] = [];
        for(let i = 0; i< nCircles ; i++){
          let circleGeometry  : THREE.Geometry = new THREE.CircleGeometry(5);
          circleGeometrys.push(circleGeometry);          
          }
          return circleGeometrys;
      }
    
      private getCircleMaterial(): THREE.MeshBasicMaterial{
        return new THREE.MeshBasicMaterial( { color: 0xffff00} );
      }

}