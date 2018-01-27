import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {Vector3} from 'three';

/* tslint:disable:no-magic-numbers */
@Injectable()
export class TrackEditorRenderService {

  private container: HTMLDivElement;

  private renderer: THREE.WebGLRenderer;

  private camera: THREE.OrthographicCamera;

  private scene: THREE.Scene;

  private light: THREE.AmbientLight;

  private geometry: THREE.Geometry;

  private lines: THREE.Line;

  private dots: THREE.Points;

  public constructor() { }


  public initialize(container: HTMLDivElement): void {

    this.container = container;
    this.createScene();
    this.startRenderingLoop();
  }
/* tslint:disable:max-func-body-length */
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
    this.camera.position.set(0, 10, 0);
    this.camera.lookAt(new Vector3(0, 0, 0));

    // TEST to find out if the scene is working
    this.light = new THREE.AmbientLight(0xFFFFFF);
    this.scene.add(this.light);

    // BUILDING GEOMETRY
    this.geometry = new THREE.Geometry();
    for (let i: number = 0; i < 10 ; i++) {
      this.geometry.vertices.push(new THREE.Vector3(i * 30, 0, 0));
    }

    // BUILDING THE LINE
    this.lines = new THREE.Line(this.geometry, new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 100}));
    this.scene.add(this.lines);

    // SHOWING DOTS
    this.dots = new THREE.Points(this.geometry, new THREE.PointsMaterial( {color: 0x888888, size: 0.5} ));
    this.scene.add(this.dots);
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
