import { Injectable } from '@angular/core';
import * as THREE from 'three';
/* tslint:disable:no-magic-numbers */
@Injectable()
export class TrackEditorRenderService {

  private container: HTMLDivElement;

  private renderer: THREE.WebGLRenderer;

  private camera: THREE.OrthographicCamera;

  private scene: THREE.Scene;

  private light: THREE.AmbientLight;

  private dots: THREE.Geometry;

  private lines: THREE.Line;

  public constructor() { }

  public initialize(container: HTMLDivElement): void {
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

    // TEST to find out if the scene is working
    this.light = new THREE.AmbientLight(0xFFFFFF);
    this.scene.add(this.light);

    const linematerial: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({color: 0x000, linewidth: 1});

    this.dots = new THREE.Geometry();

    for (let i: number = 0; i < 10 ; i++)
      this.dots.vertices.push(new THREE.Vector3(i, 0, 0));

    this.lines = new THREE.Line(this.dots, linematerial);

    this.scene.add(this.lines);
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


}
