import { Injectable } from "@angular/core";
import * as THREE from "three";

// PERSPECTIVE_CAMERA
export const PERSPECTIVE_INITIAL_POSITION_Y: number = 100;
export const PERSPECTIVE_INITIAL_POSITION_Z: number = 1;
const NEAR_CLIPPING_PLANE: number = 1;
const FAR_CLIPPING_PLANE: number = 1000;
const PERSPECTIVE_FIELD_OF_VIEW: number = 40;


// ORTHOGRAPHIC_CAMERA
export const ORTHOGRAPHIC_INITIAL_POSITION_Y: number = 100;
const ORTHOGRAPHIC_FIELD_OF_VIEW: number = 50;
const ORTHOGRAPHIC_CAMERA_NEAR_PLANE: number = -10;
const ORTHOGRAPHIC_CAMERA_FAR_PLANE: number = 1000;

enum CameraType { PERSPECTIVE, ORTHOGRAPHIC }

@Injectable()
export class CameraService {

    private camera: CameraType;
    private _orthographicCamera: THREE.OrthographicCamera;
    private _perspectiveCamera: THREE.PerspectiveCamera;
    private target: THREE.Object3D;
    private container: HTMLDivElement;

    public constructor() {
        this.camera = CameraType.PERSPECTIVE;
        this._orthographicCamera = null;
        this._perspectiveCamera = null;
        this.target = null;
        this.container = null;
     }

    public get perspectiveCamera(): THREE.PerspectiveCamera {
        return this._perspectiveCamera;
    }

    public get orthographicCamera(): THREE.OrthographicCamera {
        return this._orthographicCamera;
    }

    public initialize(container: HTMLDivElement, target: THREE.Object3D): void {
        this.container = container;
        this.target = target;
        this.initializeCameras();
    }

    public initializeCameras(): void {
        this.initializeOrhographicCamera();
        this.initializePerspectiveCamera();
    }

    public updatePosition(): void {
        this.updateOrhographicCameraPosition();
        this.updatePerspectiveCameraPosition();
    }

    public getCamera(): THREE.Camera {
        return this.camera === CameraType.ORTHOGRAPHIC ? this._orthographicCamera : this._perspectiveCamera;
    }

    public changeCamera(): void {
        this.camera === CameraType.PERSPECTIVE ? this.camera = CameraType.ORTHOGRAPHIC : this.camera = CameraType.PERSPECTIVE;
    }

    private initializeOrhographicCamera(): void {
        // tslint:disable:no-magic-numbers
        this._orthographicCamera = new THREE.OrthographicCamera (
            ORTHOGRAPHIC_FIELD_OF_VIEW / - 2,
            ORTHOGRAPHIC_FIELD_OF_VIEW / 2,
            ORTHOGRAPHIC_FIELD_OF_VIEW / this.getAspectRatio() / 2,
            ORTHOGRAPHIC_FIELD_OF_VIEW / this.getAspectRatio() / - 2,
            ORTHOGRAPHIC_CAMERA_NEAR_PLANE,
            ORTHOGRAPHIC_CAMERA_FAR_PLANE
        );
        // tslint:enable:no-magic-numbers
        this._orthographicCamera.position.x = this.target.position.x;
        this._orthographicCamera.position.y = ORTHOGRAPHIC_INITIAL_POSITION_Y;
        this._orthographicCamera.position.z = this.target.position.z;

        this._orthographicCamera.lookAt(this.target.position);
    }

    private initializePerspectiveCamera(): void {
        this._perspectiveCamera = new THREE.PerspectiveCamera (
            PERSPECTIVE_FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
        this._perspectiveCamera.position.x = this.target.position.x;
        this._perspectiveCamera.position.y = this.target.position.y;
        this._perspectiveCamera.position.z = this.target.position.z;
    }

    private updateOrhographicCameraPosition(): void {
        this._orthographicCamera.position.x = this.target.position.x;
        this._orthographicCamera.position.z = this.target.position.z;
    }

    private updatePerspectiveCameraPosition(): void {
        const relativeCameraOffset: THREE.Vector3 = new THREE.Vector3(0, PERSPECTIVE_INITIAL_POSITION_Y, PERSPECTIVE_INITIAL_POSITION_Z);
        const cameraOffset: THREE.Vector3 = relativeCameraOffset.applyMatrix4( this.target.matrix );

        this._perspectiveCamera.position.x = cameraOffset.x;
        this._perspectiveCamera.position.z = cameraOffset.z;
        this._perspectiveCamera.position.y = cameraOffset.y;
        this._perspectiveCamera.lookAt(this.target.position);
    }

    private getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }
}
