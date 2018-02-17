import { Injectable } from '@angular/core';
// import { PerspectiveCamera, OrthographicCamera, Camera, Object3D } from 'three';
import * as THREE from 'three';


// PERSPECTIVE_CAMERA
const NEAR_CLIPPING_PLANE: number = 1;
const FAR_CLIPPING_PLANE: number = 100;
const PERSPECTIVE_FIELD_OF_VIEW: number = 40;
const PERSPECTIVE_INITIAL_POSITION_Y: number = 10;
const PERSPECTIVE_INITIAL_POSITION_Z: number = 30;

// ORTHOGRAPHIC_CAMERA
const ORTHOGRAPHIC_INITIAL_POSITION_Y: number = 100;
const ORTHOGRAPHIC_FIELD_OF_VIEW: number = 50;
const ORTHOGRAPHIC_CAMERA_NEAR_PLANE: number = 0;
const ORTHOGRAPHIC_CAMERA_FAR_PLANE: number = 100;


enum CameraType { PERSPECTIVE, ORTHOGRAPHIC }

@Injectable()
export class CameraService {

    private camera: CameraType;
    private orthographicCamera: THREE.OrthographicCamera;
    private perspectiveCamera: THREE.PerspectiveCamera;
    private target: THREE.Object3D;
    private container: HTMLDivElement;

    public constructor() {
        this.camera = CameraType.PERSPECTIVE;
     }

    public initialize(container: HTMLDivElement, target: THREE.Object3D): void {
        this.container = container;
        this.target = target;
        this.initializeCameras();
    }

    public getCamera(): THREE.Camera {
        return this.camera === CameraType.ORTHOGRAPHIC ? this.orthographicCamera : this.perspectiveCamera;
    }

    public changeCamera(): void {
        this.camera === CameraType.PERSPECTIVE ? this.camera = CameraType.ORTHOGRAPHIC : this.camera = CameraType.PERSPECTIVE;
    }

    private getAspectRatio(): number {
      return this.container.clientWidth / this.container.clientHeight;
    }

    public initializeCameras(): void {
        /*tslint:disable:no-magic-numbers */
        this.orthographicCamera = new THREE.OrthographicCamera (
            ORTHOGRAPHIC_FIELD_OF_VIEW / - 2,
            ORTHOGRAPHIC_FIELD_OF_VIEW / 2,
            ORTHOGRAPHIC_FIELD_OF_VIEW / this.getAspectRatio() / 2,
            ORTHOGRAPHIC_FIELD_OF_VIEW / this.getAspectRatio() / - 2,
            ORTHOGRAPHIC_CAMERA_NEAR_PLANE,
            ORTHOGRAPHIC_CAMERA_FAR_PLANE
        );
        /*tslint:enable:no-magic-numbers*/
        this.orthographicCamera.position.x = this.target.position.x;
        this.orthographicCamera.position.y = ORTHOGRAPHIC_INITIAL_POSITION_Y;
        this.orthographicCamera.position.z = this.target.position.z;

        this.orthographicCamera.lookAt(this.target.position);


        this.perspectiveCamera = new THREE.PerspectiveCamera (
            PERSPECTIVE_FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
    }

    public updatePosition(): void {
       this.orthographicCamera.position.x = this.target.position.x;
       this.orthographicCamera.position.z = this.target.position.z;


       const relativeCameraOffset: THREE.Vector3 = new THREE.Vector3(0, PERSPECTIVE_INITIAL_POSITION_Y, PERSPECTIVE_INITIAL_POSITION_Z);
       const cameraOffset: THREE.Vector3 = relativeCameraOffset.applyMatrix4( this.target.matrix );

       this.perspectiveCamera.position.x = cameraOffset.x;
       this.perspectiveCamera.position.z = cameraOffset.z;
       this.perspectiveCamera.position.y = cameraOffset.y;
       this.perspectiveCamera.lookAt(this.target.position);
    }

}
