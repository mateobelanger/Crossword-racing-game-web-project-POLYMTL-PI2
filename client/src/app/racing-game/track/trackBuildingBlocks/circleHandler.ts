import { Waypoint } from "../trackData/waypoint";
import { POINT, CIRCLE_POSITION_Z } from "../../constants";
import * as THREE from "three";

const CIRCLE_RADIUS: number = 10;
const CIRCLE_QUALITY: number = 15;

export class CircleHandler {

    private meshs: THREE.Mesh[];

    public constructor(private scene: THREE.Scene) {
        this.meshs = [];
    }

    public generateCircles(waypoints: Waypoint[], hasReversedAxes: boolean): void {
        const circleGeometries: THREE.Geometry[] = this.generateCircleGeometry(waypoints.length);

        const material: THREE.MeshBasicMaterial = this.getCircleMaterial();
        circleGeometries.forEach((geometry, index) => {
            const mesh: THREE.Mesh = new THREE.Mesh( geometry, this.meshs.length === 0 ? this.getFirstCircleMaterial() : material );
            mesh.name = POINT;
            mesh.position.z = CIRCLE_POSITION_Z;
            const axis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
            hasReversedAxes ? mesh.rotateOnAxis(axis, Math.PI / 2) : mesh.rotateOnAxis(axis, 0);

            this.bindMesh(mesh, waypoints[index]);
        });
        this.meshs.forEach((mesh) => {
            this.scene.add(mesh);
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
        this.moveCircle(mesh.id, waypoint.position);
    }

    private generateCircleGeometry(nCircles: number): THREE.Geometry[] {
        const circleGeometries: THREE.Geometry[] = [];
        for (let i: number = 0; i < nCircles ; i++) {
          const circleGeometry: THREE.Geometry = new THREE.CircleGeometry(CIRCLE_RADIUS, CIRCLE_QUALITY);
          circleGeometries.push(circleGeometry);
          }

        return circleGeometries;
      }

    private getFirstCircleMaterial(): THREE.MeshBasicMaterial {
        const createTexture: THREE.Texture =
        new THREE.TextureLoader().load("../../../../assets/track_editor_texture/first_button_texture-v2.jpg");

        return new THREE.MeshBasicMaterial({ map: createTexture, side: THREE.DoubleSide});
    }

    private getCircleMaterial(): THREE.MeshBasicMaterial {
        const createTexture: THREE.Texture =
              new THREE.TextureLoader().load("../../../../assets/track_editor_texture/buttons_texture-v2.jpg");

        return new THREE.MeshBasicMaterial({ map: createTexture, side: THREE.DoubleSide});
    }
}
