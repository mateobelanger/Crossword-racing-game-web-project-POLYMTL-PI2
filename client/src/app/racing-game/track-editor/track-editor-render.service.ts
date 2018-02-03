import { Injectable } from '@angular/core';
import { Track } from '../track/trackData/track';
import { CircleHandler} from '../track/trackBuildingBlocks/circles';
//import { INITIAL_CAMERA_POSITION_Z } from '../constants';
import * as THREE from 'three';

const INITIAL_CAMERA_POSITION_Z: number = 50;
const ORTHOGRAPHIC_CAMERA_NEAR_PLANE: number = 0;
const ORTHOGRAPHIC_CAMERA_FAR_PLANE: number = 100;
const BACKGROUND_PLANE_POSITION_Z: number = -3;

@Injectable()
export class TrackEditorRenderService {

    private container: HTMLDivElement;

    private renderer: THREE.WebGLRenderer;

    private camera: THREE.OrthographicCamera;

    private mouse: THREE.Vector2;

    private raycaster: THREE.Raycaster;

    private scene: THREE.Scene;

    private circleHandler: CircleHandler;

    private backgroundPlan: THREE.Object3D;


    public constructor() { }

    public initialize(container: HTMLDivElement, track: Track): void {
        this.container = container;
        this.createScene(track);
        this.startRenderingLoop();
    }

    private createScene(track: Track): void {
        this.scene = new THREE.Scene();

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.camera = new THREE.OrthographicCamera (
          this.container.clientWidth / - 2,
          this.container.clientWidth / 2,
          this.container.clientHeight / 2,
          this.container.clientHeight / - 2,
          ORTHOGRAPHIC_CAMERA_NEAR_PLANE, 
          ORTHOGRAPHIC_CAMERA_FAR_PLANE 
        );
        this.camera.position.set(0, 0, INITIAL_CAMERA_POSITION_Z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.circleHandler = new CircleHandler(this.scene);

        //TODO : VÉRIFIER S'IL EXISTE DES DEFINE. (POUR LES COULEURS)
        this.backgroundPlan = new THREE.Mesh(
          new THREE.PlaneGeometry(this.container.clientWidth, this.container.clientHeight),
          new THREE.MeshBasicMaterial({color: 0x4A7023})
        );
        this.backgroundPlan.position.z = BACKGROUND_PLANE_POSITION_Z;
        this.backgroundPlan.name = "backgroundPlane";
        this.scene.add(this.backgroundPlan);
    }

    private startRenderingLoop(): void {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.renderer.render(this.scene, this.camera);
    }

    public getObjectsPointedByMouse(event: MouseEvent): THREE.Intersection[] {
        this.updateRaycastMousePos(event);
  
        return this.raycaster.intersectObjects(this.scene.children);
    }

    public getBackgroundPlaneWithRaycast(): THREE.Intersection[] {
        return this.raycaster.intersectObject(this.backgroundPlan);
    }
    
    public updateRaycastMousePos(event: MouseEvent): THREE.Vector2 {
        this.mouse.x = ( event.offsetX / this.container.clientWidth ) * 2 - 1;
        this.mouse.y = -( event.offsetY / this.container.clientHeight ) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        return this.mouse;
    }

    public getMousePos(): THREE.Vector2 {
        return this.mouse;
    }

    public getCircleHandler (): CircleHandler {
        return this.circleHandler;
    }
    //TODO : Remove ceci
    /* 
    private exportSceneForDebug() : void {
      (window as any).scene = this.scene;
    }
    */
}
