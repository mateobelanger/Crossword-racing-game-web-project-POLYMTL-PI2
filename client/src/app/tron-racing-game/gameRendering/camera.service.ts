import { Injectable } from "@angular/core";
import * as THREE from "three";

// PERSPECTIVE_CAMERA
export const PERSPECTIVE_INITIAL_POSITION_Y: number = 3;
export const PERSPECTIVE_INITIAL_POSITION_Z: number = 20;
const NEAR_CLIPPING_PLANE: number = 1;
const FAR_CLIPPING_PLANE: number = 500;
const PERSPECTIVE_FIELD_OF_VIEW: number = 40;

// ORTHOGRAPHIC_CAMERA
export const ORTHOGRAPHIC_INITIAL_POSITION_Y: number = 15;
export const ORTHOGRAPHIC_FIELD_OF_VIEW: number = 50;
export const ORTHOGRAPHIC_CAMERA_NEAR_PLANE: number = -10;
export const ORTHOGRAPHIC_CAMERA_FAR_PLANE: number = 1000;

// ZOOM
export const CAMERA_ZOOM_ADJUSTMENT: number = 0.04;
export const CAMERA_INITIAL_ZOOM: number = 1;
export const CAMERA_MAX_ZOOM: number = 5;
export const CAMERA_MIN_ZOOM: number = 1;

enum CameraType { PERSPECTIVE, ORTHOGRAPHIC }

@Injectable()
export class CameraService {

    private _camera: CameraType;
    private _orthographicCamera: THREE.OrthographicCamera;
    private _perspectiveCamera: THREE.PerspectiveCamera;
    private _target: THREE.Object3D;
    private _container: HTMLDivElement;
    private _zoomFactor: number;
    private _isZoomingIn: boolean;
    private _isZoomingOut: boolean;

    public constructor() {
        this._camera = CameraType.PERSPECTIVE;
        this._orthographicCamera = null;
        this._perspectiveCamera = null;
        this._target = null;
        this._container = null;
        this._zoomFactor = CAMERA_INITIAL_ZOOM;
        this.isZoomingIn = false;
        this.isZoomingOut = false;
     }

    public get perspectiveCamera(): THREE.PerspectiveCamera {
        return this._perspectiveCamera;
    }

    public get orthographicCamera(): THREE.OrthographicCamera {
        return this._orthographicCamera;
    }

    public set isZoomingIn(isZoomingIn: boolean) {
        this._isZoomingIn = isZoomingIn;
    }

    public set isZoomingOut(isZoomingOut: boolean) {
        this._isZoomingOut = isZoomingOut;
    }

    public initialize(_container: HTMLDivElement, _target: THREE.Object3D): void {
        this._container = _container;
        this._target = _target;
        this.initializeCameras();
    }

    public initializeCameras(): void {
        this.initializeOrhographicCamera();
        this.initializePerspectiveCamera();
    }

    public updatePosition(): void {
        if (this._isZoomingIn) {
            this.zoomIn();
        }
        if (this._isZoomingOut) {
            this.zoomOut();
        }
        this.updateOrhographicCameraPosition();
        this.updatePerspectiveCameraPosition();
    }

    public getCamera(): THREE.Camera {
        return this._camera === CameraType.ORTHOGRAPHIC ? this._orthographicCamera : this._perspectiveCamera;
    }

    public changeCamera(): void {
        this._camera = this._camera === CameraType.PERSPECTIVE ? CameraType.ORTHOGRAPHIC : CameraType.PERSPECTIVE;
    }

    public zoomIn(): void {
        if (this._zoomFactor < CAMERA_MAX_ZOOM) {
            this._zoomFactor += CAMERA_ZOOM_ADJUSTMENT;
            this.updateZooms();
        }
    }

    public zoomOut(): void {
        if (this._zoomFactor > CAMERA_MIN_ZOOM) {
            this._zoomFactor -= CAMERA_ZOOM_ADJUSTMENT;
            this.updateZooms();
        }
    }

    private initializeOrhographicCamera(): void {
        this._orthographicCamera = new THREE.OrthographicCamera (
            ORTHOGRAPHIC_FIELD_OF_VIEW / - 2,
            ORTHOGRAPHIC_FIELD_OF_VIEW / 2,
            ORTHOGRAPHIC_FIELD_OF_VIEW / this.getAspectRatio() / 2,
            ORTHOGRAPHIC_FIELD_OF_VIEW / this.getAspectRatio() / - 2,
            ORTHOGRAPHIC_CAMERA_NEAR_PLANE,
            ORTHOGRAPHIC_CAMERA_FAR_PLANE
        );
        this._orthographicCamera.position.x = this._target.position.x;
        this._orthographicCamera.position.y = ORTHOGRAPHIC_INITIAL_POSITION_Y;
        this._orthographicCamera.position.z = this._target.position.z;

        this._orthographicCamera.lookAt(this._target.position);
    }

    private initializePerspectiveCamera(): void {
        this._perspectiveCamera = new THREE.PerspectiveCamera (
            PERSPECTIVE_FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
        this._perspectiveCamera.position.x = this._target.position.x;
        this._perspectiveCamera.position.y = this._target.position.y;
        this._perspectiveCamera.position.z = this._target.position.z;
    }

    private updateOrhographicCameraPosition(): void {
        this._orthographicCamera.position.x = this._target.position.x;
        this._orthographicCamera.position.z = this._target.position.z;
    }

    private updatePerspectiveCameraPosition(): void {
        const relativeCameraOffset: THREE.Vector3 = new THREE.Vector3(0, PERSPECTIVE_INITIAL_POSITION_Y, PERSPECTIVE_INITIAL_POSITION_Z);
        const cameraOffset: THREE.Vector3 = relativeCameraOffset.applyMatrix4( this._target.matrix );

        this._perspectiveCamera.position.x = cameraOffset.x;
        this._perspectiveCamera.position.z = cameraOffset.z;
        this._perspectiveCamera.position.y = cameraOffset.y;
        this._perspectiveCamera.lookAt(this._target.position);
    }

    private getAspectRatio(): number {
        return this._container.clientWidth / this._container.clientHeight;
    }

    private updateZooms(): void {
        this.updateOrthographicZoom();
        this.updatePerspectiveZoom();
    }

    private updateOrthographicZoom(): void {
        this.orthographicCamera.zoom = this._zoomFactor;
        this.orthographicCamera.updateProjectionMatrix();
    }

    private updatePerspectiveZoom(): void {
        this.perspectiveCamera.zoom = this._zoomFactor;
        this.perspectiveCamera.updateProjectionMatrix();
    }
}
