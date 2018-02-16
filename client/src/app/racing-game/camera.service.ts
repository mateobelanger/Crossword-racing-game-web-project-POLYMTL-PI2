import { Injectable } from '@angular/core';
// import { PerspectiveCamera, OrthographicCamera, Camera, Object3D } from 'three';
import * as THREE from 'three';

const FAR_CLIPPING_PLANE: number = 100;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 40;

const INITIAL_CAMERA_POSITION_Y: number = 80;

const ORTHOGRAPHIC_CAMERA_NEAR_PLANE: number = 0;
const ORTHOGRAPHIC_CAMERA_FAR_PLANE: number = 100;


enum CameraType { PERSPECTIVE, ORTHOGRAPHIC }

@Injectable()
export class CameraService {

    private container: HTMLDivElement;

    private camera: CameraType;

    private orthographicCamera: THREE.OrthographicCamera;

    private perspectiveCamera: THREE.PerspectiveCamera;

    private carToFollow: THREE.Object3D;

    public constructor() {
        this.camera = CameraType.PERSPECTIVE;
     }

    public changeCamera(): void {
        this.camera === CameraType.PERSPECTIVE ? this.camera = CameraType.ORTHOGRAPHIC : this.camera = CameraType.PERSPECTIVE;
    }

    public getCamera(): THREE.Camera {
        return this.camera === CameraType.ORTHOGRAPHIC ? this.orthographicCamera : this.perspectiveCamera;
    }


    public getperspectiveCamera(): THREE.PerspectiveCamera {
        return this.perspectiveCamera;
    }

    public initialization(container: HTMLDivElement, carToFollow: THREE.Object3D): void {
        if (container) {
            this.container = container;
        }
        this.carToFollow = carToFollow;
    }


    private getAspectRatio(): number {
      return this.container.clientWidth / this.container.clientHeight;
    }

    public initCameras(): void {
        /*tslint:disable:no-magic-numbers */

        this.orthographicCamera = new THREE.OrthographicCamera (
            40 / - 2,
            40 / 2,
            40 / this.getAspectRatio() / 2,
            40 / this.getAspectRatio() / - 2,
            ORTHOGRAPHIC_CAMERA_NEAR_PLANE,
            ORTHOGRAPHIC_CAMERA_FAR_PLANE
        );
        /*tslint:enable:no-magic-numbers*/
        this.orthographicCamera.position.x = this.carToFollow.position.x;
        this.orthographicCamera.position.y = INITIAL_CAMERA_POSITION_Y;
        this.orthographicCamera.position.z = this.carToFollow.position.z;

        this.orthographicCamera.lookAt(this.carToFollow.position);


        this.perspectiveCamera = new THREE.PerspectiveCamera (
            FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        // TODO: PerspectivveCamera :
        // INITIALIZE PERSPECTIVE CAMERA'S POSITION
    }

    public cameraFollowCarPosition(): void {


       this.orthographicCamera.position.x = this.carToFollow.position.x;
       this.orthographicCamera.position.z = this.carToFollow.position.z;

       // TODO for PerspectivveCamera :
       // Tourner caméra quand auto tourne

       // const matrix: THREE.Matrix4 = new THREE.Matrix4();
       // matrix.extractRotation( this.carToFollow.matrix );
       const relativeCameraOffset: THREE.Vector3 = new THREE.Vector3(0, 0, 10);

       const cameraOffset: THREE.Vector3 = relativeCameraOffset.applyMatrix4( this.carToFollow.matrix );

       this.perspectiveCamera.position.x = cameraOffset.x;
       this.perspectiveCamera.position.z = cameraOffset.y;
       this.perspectiveCamera.position.y = cameraOffset.z;
       this.perspectiveCamera.lookAt(this.carToFollow.position);
    }

    public camerasOnResize(aspectRatio: number): void {

        //this.orthographicCamera.left   =  this.container.clientWidth   / aspectRatio / - 2,
        //this.orthographicCamera.right  =  this.container.clientWidth   / aspectRatio / 2,
        //this.orthographicCamera.top    =  this.container.clientHeight  / aspectRatio / 2,
        //this.orthographicCamera.bottom =  this.container.clientHeight  / aspectRatio / - 2,
        //this.orthographicCamera.updateProjectionMatrix();

        this.perspectiveCamera.aspect = aspectRatio;
        this.perspectiveCamera.updateProjectionMatrix();
    }

}
