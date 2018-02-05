import { Injectable } from '@angular/core';
import { PerspectiveCamera, OrthographicCamera, Camera, Vector3} from 'three';

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const INITIAL_CAMERA_POSITION_Y: number = 25;

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

    private carVectorToFollow: Vector3;

    private initialAspectRatio: number;

    public constructor() {
        this.camera = CameraType.ORTHOGRAPHIC;
     }

    public changeCamera(): void {
        this.camera === CameraType.PERSPECTIVE ? this.camera = CameraType.ORTHOGRAPHIC : this.camera = CameraType.PERSPECTIVE;
    }

    public getCamera(): Camera {
        return this.camera === CameraType.ORTHOGRAPHIC ? this.orthographicCamera : this.perspectiveCamera;
    }


    public initialization(container: HTMLDivElement, carVectorToFollow: Vector3): void {
        if (container) {
            this.container = container;
        }
        this.carVectorToFollow = carVectorToFollow;
        this.initialAspectRatio = this.getAspectRatio();
    }


    private getAspectRatio(): number {
      return this.container.clientWidth / this.container.clientHeight;
    }

    public initCameras(): void {

        this.orthographicCamera = new OrthographicCamera (
            this.container.clientWidth  / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / this.initialAspectRatio / - 2,
            this.container.clientWidth  / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / this.initialAspectRatio / 2,
            this.container.clientHeight / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / this.initialAspectRatio / 2,
            this.container.clientHeight / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / this.initialAspectRatio / - 2,
            ORTHOGRAPHIC_CAMERA_NEAR_PLANE,
            ORTHOGRAPHIC_CAMERA_FAR_PLANE
        );

        this.orthographicCamera.position.x = this.carVectorToFollow.x;
        this.orthographicCamera.position.y = INITIAL_CAMERA_POSITION_Y;
        this.orthographicCamera.position.z = this.carVectorToFollow.z;

        this.orthographicCamera.lookAt(this.carVectorToFollow);


        this.perspectiveCamera = new PerspectiveCamera (
            FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        // TODO: PerspectivveCamera :
        // INITIALIZE PERSPECTIVE CAMERA'S POSITION
        this.perspectiveCamera.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
        this.perspectiveCamera.lookAt(this.carVectorToFollow);
    }

    public cameraFollowCarPosition(): void {

       this.orthographicCamera.position.x = this.carVectorToFollow.x;
       this.orthographicCamera.position.z = this.carVectorToFollow.z;

       // TODO for PerspectivveCamera :
       // Change it when perspective Camera is gonna be set.
       this.perspectiveCamera.position.x = this.carVectorToFollow.x;
       this.perspectiveCamera.position.z = this.carVectorToFollow.z;

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
