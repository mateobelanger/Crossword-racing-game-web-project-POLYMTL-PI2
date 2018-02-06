import {Waypoint} from "../trackData/waypoint";
import * as THREE from "three";

const CIRCLE_RADIUS: number = 10;

export class CircleHandler {

    private meshs: THREE.Mesh[] = [];

    public constructor(private scene: THREE.Scene) {
    }

    public generateCircles(waypoints: Waypoint[]): void {
        const circleGeometries: THREE.Geometry[] = this.generateCircleGeometry(waypoints.length);
        const material: THREE.MeshBasicMaterial = this.getCircleMaterial();
        circleGeometries.forEach((geometry, index) => {
            const mesh: THREE.Mesh = new THREE.Mesh( geometry, this.meshs.length === 0 ? this.getFirstCircleMaterial() : material );
            this.meshs.push(mesh);
            mesh.name = "point";
            this.scene.add(mesh);
            this.bindMesh(mesh, waypoints[index]);
        });
      }

    public removeCircle(meshId: number): void {
        const index: number = this.findMeshIndex(meshId);
        this.scene.remove(this.meshs[index]);
        this.meshs.splice(index, 1);
    }

    public moveCircle(id: number, absolutePosition: THREE.Vector3): void {
        const mesh: THREE.Mesh = this.meshs[this.findMeshIndex(id)];
        const relativeMovement: THREE.Vector3 = new THREE.Vector3();
        relativeMovement.subVectors(absolutePosition, mesh.position);
        mesh.translateX(relativeMovement.x);
        mesh.translateY(relativeMovement.y);
        mesh.translateZ(relativeMovement.z);
    }

    public getCircles(): THREE.Mesh[] {
        return this.meshs;
    }

    private findMeshIndex(id: number): number {
        let index: number = null;
        this.meshs.forEach((element, i) => {
            if (element.id === id)
                index = i;
        });

        return index;
    }

    private bindMesh(mesh: THREE.Mesh, waypoint: Waypoint): void {
        waypoint.unbindCircle();
        waypoint.bindCircle(mesh.id);
        this.moveCircle(mesh.id, waypoint.getPosition());
    }

    private generateCircleGeometry(nCircles: number): THREE.Geometry[] {
        const circleGeometries: THREE.Geometry[] = [];
        for (let i: number = 0; i < nCircles ; i++) {
          const circleGeometry: THREE.Geometry = new THREE.CircleGeometry(CIRCLE_RADIUS);
          circleGeometries.push(circleGeometry);
          }

        return circleGeometries;
      }

    private getFirstCircleMaterial(): THREE.MeshBasicMaterial {
        let createTexture: THREE.Texture = new THREE.Texture;
        createTexture = new THREE.TextureLoader().load("../../../../assets/track_editor_texture/first_button_texture_3.png");

        return new THREE.MeshBasicMaterial({ map: createTexture, side: THREE.DoubleSide});
    }

    private getCircleMaterial(): THREE.MeshBasicMaterial {
        let createTexture: THREE.Texture = new THREE.Texture;
        createTexture = new THREE.TextureLoader().load("../../../../assets/track_editor_texture/buttons_texture.png");

        return new THREE.MeshBasicMaterial({ map: createTexture, side: THREE.DoubleSide});
    }
}
