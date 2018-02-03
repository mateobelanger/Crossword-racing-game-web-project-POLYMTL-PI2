import {Waypoint} from "../trackData/waypoint";
import * as THREE from "three";

const CIRCLERADIUS = 5;

export class CircleHandler {

    private meshs : THREE.Mesh[] = [];

    constructor(private scene: THREE.Scene){
    }

    public generateCircles(waypoints : Waypoint[]){
        let circleGeometries : THREE.Geometry[] = this.generateCircleGeometry(waypoints.length);
        let material : THREE.MeshBasicMaterial = this.getCircleMaterial();
        circleGeometries.forEach((geometry,index) => {
            let mesh = new THREE.Mesh( geometry, material );
            this.meshs.push(mesh);
            this.scene.add(mesh);
            this.bindMesh(mesh, waypoints[index]);
        });
      }

    public removeCircle(meshId : number){
        let index : number = this.findMeshIndex(meshId);
        this.scene.remove(this.meshs[index]);
        this.meshs.splice(index, 1);
    }

    public moveCircle(id : number, absolutePosition : THREE.Vector3){
        let mesh : THREE.Mesh = this.meshs[this.findMeshIndex(id)];
        let relativeMovement : THREE.Vector3 = new THREE.Vector3();
        relativeMovement.subVectors(absolutePosition, mesh.position);
        mesh.translateX(relativeMovement.x);
        mesh.translateY(relativeMovement.y);
        mesh.translateZ(relativeMovement.z);
    }

    private findMeshIndex(id : number): number{
        let index : number = null;
        this.meshs.forEach((element, i)=> {
            if(element.id === id)
                index = i;
        });
        return index;
    }

    private bindMesh(mesh: THREE.Mesh, waypoint : Waypoint){
        waypoint.unbindCircle();
        waypoint.bindCircle(mesh.id);
        this.moveCircle(mesh.id, waypoint.getPosition());
    }

    private generateCircleGeometry(nCircles : number): THREE.Geometry[]{
        let circleGeometries : THREE.Geometry[] = [];
        for(let i = 0; i< nCircles ; i++){
          let circleGeometry  : THREE.Geometry = new THREE.CircleGeometry(CIRCLERADIUS);
          circleGeometries.push(circleGeometry);          
          }
          return circleGeometries;
      }
    
      private getCircleMaterial(): THREE.MeshBasicMaterial{
        return new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide} );
      }

}