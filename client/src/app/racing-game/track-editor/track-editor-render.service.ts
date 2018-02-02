import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {Track} from '../track/trackData/track';
import {CircleHandler} from '../track/trackBuildingBlocks/circles';

/* tslint:disable:no-magic-numbers */

@Injectable()
export class TrackEditorRenderService {

  private container: HTMLDivElement;

  private renderer: THREE.WebGLRenderer;

  private camera: THREE.OrthographicCamera;

  private mouse: THREE.Vector2;

  private raycaster: THREE.Raycaster;

  private scene: THREE.Scene;

  private light: THREE.AmbientLight;

  public circleHandler: CircleHandler;


  private boxAxeZ: THREE.Mesh;

  public constructor() { }


  public initialize(container: HTMLDivElement, track: Track): void {

    this.container = container;
    this.createScene(track);
    this.startRenderingLoop();

  }
/* tslint:disable:max-func-body-length */
  private createScene(track: Track): void {
    this.scene = new THREE.Scene();

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.camera = new THREE.OrthographicCamera (
      this.container.clientWidth / - 2,
      this.container.clientWidth / 2,
      this.container.clientHeight / 2,
      this.container.clientHeight / - 2,
      1,  // TODO: Put the same number on this line to have a "plane"
      100 // and this line
    );
    this.camera.position.set(0, 0, 50);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    //INSTANCIATING CIRCLEHANDLER
    this.circleHandler = new CircleHandler(this.scene);


    //TODO: TEST 
    this.boxAxeZ = new THREE.Mesh(
      new THREE.BoxGeometry(200,200,20),
      new THREE.MeshBasicMaterial({color: 0xFF0000})
    );
    this.boxAxeZ.position.z = 10;
    this.scene.add(this.boxAxeZ);
    

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
    this.updateMousePos(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    //TODO: ATTENTION JE NE SAIS PAS SI LES CERCLE FONT OFFICIELLEMENT 
    // PARTIE DES ENFANTS DE LA SCÈNE
    return this.raycaster.intersectObjects(this.scene.children);
  }

  public updateMousePos(event: MouseEvent): void {

    this.mouse.x = (event.offsetX - (this.container.clientWidth / 2));
    this.mouse.y = ((this.container.clientHeight / 2) - event.offsetY);

    // Ce qu'il y avait avant 
    //this.mouse.x = ( event.clientX / this.container.clientWidth ) * 2 - 1;
    //this.mouse.y = -( event.clientY / this.container.clientHeight ) * 2 + 1;
  }

  public getMousePos(): THREE.Vector2 {
    return this.mouse;
  }
  /*
  private exportSceneForDebug() : void {
    (window as any).scene = this.scene;
  }
  */
}
