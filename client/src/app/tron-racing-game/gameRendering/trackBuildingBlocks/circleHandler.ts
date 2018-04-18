import { Waypoint } from "../../tracks/trackData/waypoint";
import { POINT, CIRCLE_POSITION_Z, CircleType } from "../../constants";
import * as THREE from "three";

export const ASSETS_FOLDER: string = "../../../../assets/track_editor_texture/";
export const ASSETS_NAME: string[] = ["first_button_texture-v2.jpg", "first_button_texture-v3.jpg",
                                      "buttons_texture-v2.jpg", "buttons_texture-v3.jpg"];
const CIRCLE_RADIUS: number = 10;
const CIRCLE_QUALITY: number = 15;

export class CircleHandler {

    private _meshs: THREE.Mesh[];

    public constructor(private scene: THREE.Scene) {
        this._meshs = [];
    }

    public generateCircles(waypoints: Waypoint[], hasReversedAxes: boolean): void {
        const circleGeometries: THREE.Geometry[] = this.generateCircleGeometry(waypoints.length);

        const material: THREE.MeshBasicMaterial = this.getCircleMaterial(!hasReversedAxes);
        circleGeometries.forEach((geometry, index) => {
            const mesh: THREE.Mesh = new THREE.Mesh( geometry, this._meshs.length === 0 ?
                                                     this.getFirstCircleMaterial(!hasReversedAxes) : material );
            this._meshs.push(mesh);
            mesh.name = POINT;

            mesh.position.z = CIRCLE_POSITION_Z;
            const axis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
            hasReversedAxes ? mesh.rotateOnAxis(axis, Math.PI / 2) : mesh.rotateOnAxis(axis, 0);

            this.bindMesh(mesh, waypoints[index]);
        });
        this._meshs.forEach((mesh) => {
            this.scene.add(mesh);
        });

      }

    public removeCircle(meshId: number): void {
        const index: number = this.findMeshIndex(meshId);
        this.scene.remove(this._meshs[index]);
        this._meshs.splice(index, 1);
    }

    public moveCircle(id: number, absolutePosition: THREE.Vector3): void {
        const mesh: THREE.Mesh = this._meshs[this.findMeshIndex(id)];
        const relativeMovement: THREE.Vector3 = new THREE.Vector3();
        relativeMovement.subVectors(absolutePosition, mesh.position);
        mesh.translateX(relativeMovement.x);
        mesh.translateY(relativeMovement.y);
        mesh.translateZ(relativeMovement.z);
    }

    public getCircles(): THREE.Mesh[] {
        return this._meshs;
    }

    private findMeshIndex(id: number): number {
        let index: number = null;
        this._meshs.forEach((element, i) => {
            if (element.id === id) {
                index = i;
            }
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

    private getFirstCircleMaterial(isInTrackEditor: boolean): THREE.MeshPhongMaterial {
        const createTexture: THREE.Texture = isInTrackEditor ?
        new THREE.TextureLoader().load(ASSETS_FOLDER + ASSETS_NAME[CircleType.TRACK_EDITOR_FIRST_CRICLE]) :
        new THREE.TextureLoader().load(ASSETS_FOLDER + ASSETS_NAME[CircleType.TRACK_FIRST_CRICLE]);

        return new THREE.MeshPhongMaterial({ map: createTexture, side: THREE.DoubleSide});
    }

    private getCircleMaterial(inTrackEditor: boolean): THREE.MeshPhongMaterial {
        const createTexture: THREE.Texture = inTrackEditor ?
              new THREE.TextureLoader().load(ASSETS_FOLDER + ASSETS_NAME[CircleType.TRACK_EDITOR_CRICLES]) :
              new THREE.TextureLoader().load(ASSETS_FOLDER + ASSETS_NAME[CircleType.TRACK_CRICLES]);

        return new THREE.MeshPhongMaterial({ map: createTexture, side: THREE.DoubleSide});
    }
}
