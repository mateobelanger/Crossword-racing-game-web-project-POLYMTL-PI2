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

    private _container: HTMLDivElement;
    private _camera: CameraType;
    private _orthographicCamera: OrthographicCamera;
    private _perspectiveCamera: PerspectiveCamera;
    private _carVectorToFollow: Vector3;
    private _initialAspectRatio: number;

    public constructor() {
        this._camera = CameraType.ORTHOGRAPHIC;
     }

    public changeCamera(): void {
        this._camera === CameraType.PERSPECTIVE ? this._camera = CameraType.ORTHOGRAPHIC : this._camera = CameraType.PERSPECTIVE;
    }

    public get camera(): Camera {
        return this._camera === CameraType.ORTHOGRAPHIC ? this._orthographicCamera : this._perspectiveCamera;
    }


    public initialization(container: HTMLDivElement, carVectorToFollow: Vector3): void {
        if (container) {
            this._container = container;
        }
        this._carVectorToFollow = carVectorToFollow;
        this._initialAspectRatio = this.getAspectRatio();
    }


    private getAspectRatio(): number {
      return this._container.clientWidth / this._container.clientHeight;
    }

    public initCameras(): void {
        /*tslint:disable:no-magic-numbers */
        this._orthographicCamera = new OrthographicCamera (
            this._container.clientWidth  / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / this._initialAspectRatio / - 2,
            this._container.clientWidth  / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / this._initialAspectRatio / 2,
            this._container.clientHeight / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / this._initialAspectRatio / 2,
            this._container.clientHeight / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / this._initialAspectRatio / - 2,
            ORTHOGRAPHIC_CAMERA_NEAR_PLANE,
            ORTHOGRAPHIC_CAMERA_FAR_PLANE
        );
        /*tslint:enable:no-magic-numbers*/
        this._orthographicCamera.position.x = this._carVectorToFollow.x;
        this._orthographicCamera.position.y = INITIAL_CAMERA_POSITION_Y;
        this._orthographicCamera.position.z = this._carVectorToFollow.z;

        this._orthographicCamera.lookAt(this._carVectorToFollow);


        this._perspectiveCamera = new PerspectiveCamera (
            FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        // TODO: PerspectivveCamera :
        // INITIALIZE PERSPECTIVE CAMERA'S POSITION
        this._perspectiveCamera.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
        this._perspectiveCamera.lookAt(this._carVectorToFollow);
    }

    public cameraFollowCarPosition(): void {

       this._orthographicCamera.position.x = this._carVectorToFollow.x;
       this._orthographicCamera.position.z = this._carVectorToFollow.z;

       // TODO for PerspectivveCamera :
       // Change it when perspective Camera is gonna be set.
       this._perspectiveCamera.position.x = this._carVectorToFollow.x;
       this._perspectiveCamera.position.z = this._carVectorToFollow.z;

    }

    public camerasOnResize(aspectRatio: number): void {

        this._orthographicCamera.left   =  this._container.clientWidth  / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / aspectRatio / - 2,
        this._orthographicCamera.right  =  this._container.clientWidth  / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / aspectRatio / 2,
        this._orthographicCamera.top    =  this._container.clientHeight / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / aspectRatio / 2,
        this._orthographicCamera.bottom =  this._container.clientHeight / ORTHOGRAPHIC_CAMERA_VIEW_RATIO / aspectRatio / - 2,
        this._orthographicCamera.updateProjectionMatrix();

        this._perspectiveCamera.aspect = aspectRatio;
        this._perspectiveCamera.updateProjectionMatrix();
    }

}
