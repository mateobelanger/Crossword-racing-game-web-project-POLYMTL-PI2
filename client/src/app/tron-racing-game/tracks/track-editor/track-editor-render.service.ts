import { Injectable } from "@angular/core";

// import { Track } from "../track/trackData/track";
import { CircleHandler } from "../../gameRendering/trackBuildingBlocks/circleHandler";
import { PlaneHandler } from "../../gameRendering/trackBuildingBlocks/planeHandler";
import { BackgroundPlane } from "../../gameRendering/trackBuildingBlocks/backgroundPlane";
import * as THREE from "three";

const INITIAL_CAMERA_POSITION_Z: number = 50;
const ORTHOGRAPHIC_CAMERA_NEAR_PLANE: number = 0;
const ORTHOGRAPHIC_CAMERA_FAR_PLANE: number = 100;
const IMAGE_QUALITY: number = 0.5;

const AMBIENT_LIGHT_OPACITY: number = 1;
const AMBIENT_LIGHT_COLOR: number = 0xFFFFFF;

@Injectable()
export class TrackEditorRenderService {

    public _circleHandler: CircleHandler;
    public _planeHandler: PlaneHandler;

    private _container: HTMLDivElement;
    private _renderer: THREE.WebGLRenderer;
    private _camera: THREE.OrthographicCamera;
    private _mouse: THREE.Vector2;
    private _raycaster: THREE.Raycaster;
    private _scene: THREE.Scene;
    private _backgroundPlane: BackgroundPlane;
    private ambientLight: THREE.AmbientLight;

    public constructor() {
        this._container = null;
        this._renderer = null;
        this._camera = null;
        this._mouse = null;
        this._raycaster = null;
        this._scene = null;
        this._backgroundPlane = null;
        this.ambientLight = null;
    }

    public initialize(container: HTMLDivElement): void {
        this._container = container;
        this.createScene();
        this.startRenderingLoop();
    }


    public getObjectsPointedByMouse(event: MouseEvent): THREE.Intersection[] {
        this.updateRaycastMousePos(event);

        return this._raycaster.intersectObjects(this._scene.children);
    }

    public getBackgroundPlaneWithRaycast(): THREE.Intersection[] {
        return this._raycaster.intersectObject(this._backgroundPlane.getBackgroundPlane());
    }

    public updateRaycastMousePos(event: MouseEvent): THREE.Vector2 {
        // tslint:disable:no-magic-numbers
        this._mouse.x = ( event.offsetX / this._container.clientWidth ) * 2 - 1;
        this._mouse.y = -( event.offsetY / this._container.clientHeight ) * 2 + 1;
        // tslint:enable:no-magic-numbers
        this._raycaster.setFromCamera(this._mouse, this._camera);

        return this._mouse;
    }

    public takeScreenShot(): string {
        return this._renderer.domElement.toDataURL("image/jpeg", IMAGE_QUALITY);
    }

    private createScene(): void {
        this._scene = new THREE.Scene();

        this._raycaster = new THREE.Raycaster();
        this._mouse = new THREE.Vector2();
        // tslint:disable:no-magic-numbers
        this._camera = new THREE.OrthographicCamera (
          this._container.clientWidth / -2,
          this._container.clientWidth / 2,
          this._container.clientHeight / 2,
          this._container.clientHeight / -2,
          ORTHOGRAPHIC_CAMERA_NEAR_PLANE,
          ORTHOGRAPHIC_CAMERA_FAR_PLANE
        );
        // tslint:enable:no-magic-numbers
        this._camera.position.set(0, 0, INITIAL_CAMERA_POSITION_Z);
        this._camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.ambientLight = new THREE.AmbientLight( AMBIENT_LIGHT_COLOR, AMBIENT_LIGHT_OPACITY);
        this._scene.add(this.ambientLight);

        this._circleHandler = new CircleHandler(this._scene);

        this._planeHandler = new PlaneHandler(this._scene);

        this._backgroundPlane = new BackgroundPlane(this._scene);

        this._backgroundPlane.generateBackgroundPlane();

    }

    private startRenderingLoop(): void {
        this._renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
        this._renderer.setPixelRatio(devicePixelRatio);
        this._renderer.setSize(this._container.clientWidth, this._container.clientHeight);
        this._container.appendChild(this._renderer.domElement);
        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this._renderer.render(this._scene, this._camera);
    }

}
