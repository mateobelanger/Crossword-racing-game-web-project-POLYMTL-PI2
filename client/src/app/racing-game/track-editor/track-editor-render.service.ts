import { Injectable } from '@angular/core';
import * as THREE from 'three';
/* tslint:disable:no-magic-numbers */
@Injectable()
export class TrackEditorRenderService {

  private container: HTMLDivElement;

  private renderer: THREE.WebGLRenderer;

  private camera: THREE.OrthographicCamera;

  private scene: THREE.Scene;

  private box: THREE.Mesh;

  private light: THREE.AmbientLight;

  public constructor() { }

  public initialise(container: HTMLDivElement): void { 
    this.container = container;
    this.createScene();
    this.startRenderingLoop();
  }

  private createScene(): void {
    this.scene = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera (
      this.container.clientWidth / - 2,
      this.container.clientWidth / 2,
      this.container.clientHeight / 2,
      this.container.clientHeight / - 2,
      1,  // TODO: Put the same number on this line to have a "plane"
      100 // and this line
    );

    // TEST to find out if the scene is working////
    this.light = new THREE.AmbientLight(0xFFFFFF);
    this.scene.add(this.light);

    this.box = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshBasicMaterial({color: 0xFF0000})
    );
    this.box.position.z = -10;

    this.scene.add(this.box);
  }
  ///////////////////////////////////////////////// 

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

    // TODO : Delete this part with the cube (box)
    this.box.rotation.y += 0.005;
    this.box.rotation.x += 0.005;
    ////////////////////////////////////////////////// 
  }


}
