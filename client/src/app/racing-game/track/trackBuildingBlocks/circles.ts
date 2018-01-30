import {Waypoint} from "../trackData/waypoint";
import * as THREE from "three";

const PI = 3.14159265359;

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

    public removeCircles(meshsToRemove : THREE.Mesh[]){
        meshsToRemove.forEach(meshToRemove => {
            this.scene.remove(meshToRemove);
            this.meshs = this.meshs.filter((mesh) => {meshToRemove !== mesh})
        });
    }

    //à revoir la bonne manière d'effecture les déplacements
    public moveCircle(mesh : THREE.Mesh, position : THREE.Vector3){
        mesh.rotateX(-PI*(3/2));
        mesh.translateX(position.x);
        mesh.translateY(position.y);
        mesh.translateZ(-position.z);// "-" because of the position of the camera
        mesh.rotateX(PI*(3/2));
    }

    private bindMesh(mesh: THREE.Mesh, waypoint : Waypoint){
        waypoint.setId(mesh.id);//je garde le id en attendant
        waypoint.bindCircle(mesh);
        mesh.translateX(waypoint.getPosition().x);
        mesh.translateY(waypoint.getPosition().y);
        mesh.translateZ(-waypoint.getPosition().z);// "-" because of the position of the camera
        mesh.rotateX(PI*(3/2)); //necessary to see the circle
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
        return new THREE.MeshBasicMaterial( { color: 0xffff00 } );
      }

}