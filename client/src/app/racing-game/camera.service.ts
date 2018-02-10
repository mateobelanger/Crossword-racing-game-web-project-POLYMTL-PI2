import { Injectable } from '@angular/core';
import { PerspectiveCamera, OrthographicCamera, Camera, Object3D } from 'three';

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const INITIAL_CAMERA_POSITION_Y: number = 10;

const ORTHOGRAPHIC_CAMERA_VIEW_RATIO: number = 15;
const ORTHOGRAPHIC_CAMERA_NEAR_PLANE: number = 0;
const ORTHOGRAPHIC_CAMERA_FAR_PLANE: number = 100;


enum CameraType { PERSPECTIVE, ORTHOGRAPHIC }

@Injectable()
export class CameraService {

    private container: HTMLDivElement;

    private camera: CameraType;

    private orthographicCamera: OrthographicCamera;

    private perspectiveCamera: PerspectiveCamera;

    private carToFollow: Object3D;

    private initialAspectRatio: number;

    public constructor() {
        this.camera = CameraType.PERSPECTIVE;
     }

    public changeCamera(): void {
        this.camera === CameraType.PERSPECTIVE ? this.camera = CameraType.ORTHOGRAPHIC : this.camera = CameraType.PERSPECTIVE;
    }

    public getCamera(): Camera {
        return this.camera === CameraType.ORTHOGRAPHIC ? this.orthographicCamera : this.perspectiveCamera;
    }


    public initialization(container: HTMLDivElement, carToFollow: Object3D): void {
        if (container) {
            this.container = container;
        }
        this.carToFollow = carToFollow;
        this.initialAspectRatio = this.getAspectRatio();
    }


    private getAspectRatio(): number {
      return this.container.clientWidth / this.container.clientHeight;
    }

    public initCameras(): void {
        /*tslint:disable:no-magic-numbers */
        this.orthographicCamera = new OrthographicCamera (
            this.container.clientWidth  / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / this.initialAspectRatio / - 2,
            this.container.clientWidth  / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / this.initialAspectRatio / 2,
            this.container.clientHeight / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / this.initialAspectRatio / 2,
            this.container.clientHeight / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / this.initialAspectRatio / - 2,
            ORTHOGRAPHIC_CAMERA_NEAR_PLANE,
            ORTHOGRAPHIC_CAMERA_FAR_PLANE
        );
        /*tslint:enable:no-magic-numbers*/
        this.orthographicCamera.position.x = this.carToFollow.position.x;
        this.orthographicCamera.position.y = INITIAL_CAMERA_POSITION_Y;
        this.orthographicCamera.position.z = this.carToFollow.position.z;

        this.orthographicCamera.lookAt(this.carToFollow.position);


        this.perspectiveCamera = new PerspectiveCamera (
            FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        // TODO: PerspectivveCamera :
        // INITIALIZE PERSPECTIVE CAMERA'S POSITION
        this.perspectiveCamera.position.set(this.carToFollow.position.x, INITIAL_CAMERA_POSITION_Y, this.carToFollow.position.z);
        this.perspectiveCamera.lookAt(this.carToFollow.position);

    }

    public cameraFollowCarPosition(): void {

       this.orthographicCamera.position.x = this.carToFollow.position.x;
       this.orthographicCamera.position.z = this.carToFollow.position.z;

       // TODO for PerspectivveCamera :
       // Tourner caméra quand auto tourne
       this.perspectiveCamera.position.x = this.carToFollow.position.x + 20;
       this.perspectiveCamera.position.y = INITIAL_CAMERA_POSITION_Y;
       this.perspectiveCamera.position.z = this.carToFollow.position.z;
       this.perspectiveCamera.lookAt(this.carToFollow.position);

    }

    public camerasOnResize(aspectRatio: number): void {

        this.orthographicCamera.left   =  this.container.clientWidth  / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / aspectRatio / - 2,
        this.orthographicCamera.right  =  this.container.clientWidth  / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / aspectRatio / 2,
        this.orthographicCamera.top    =  this.container.clientHeight / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / aspectRatio / 2,
        this.orthographicCamera.bottom =  this.container.clientHeight / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / aspectRatio / - 2,
        this.orthographicCamera.updateProjectionMatrix();

        this.perspectiveCamera.aspect = aspectRatio;
        this.perspectiveCamera.updateProjectionMatrix();
    }

}
