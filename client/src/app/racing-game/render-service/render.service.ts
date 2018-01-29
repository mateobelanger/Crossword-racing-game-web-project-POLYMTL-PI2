import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { PerspectiveCamera, WebGLRenderer, Scene, AmbientLight } from "three";
import { Car } from "../car/car";


//import { CameraService } from "../camera.service";

import * as THREE from 'three';

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d

const INITIAL_CAMERA_POSITION_Y: number = 25;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.8;

@Injectable()
export class RenderService {
    private camera: PerspectiveCamera;
    private container: HTMLDivElement;
    private _car: Car;
    private renderer: WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;

    private light: THREE.AmbientLight;
    // AXES
    private box1: THREE.Mesh;
    private box2: THREE.Mesh;
    private box3: THREE.Mesh;


    public get car(): Car {
        return this._car;
    }

    public constructor(/*private cameraService: CameraService*/) {
        this._car = new Car();
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this.container = container;
        }

        await this.createScene();
        this.initStats();
        //this.cameraService.initialize(this.container, this._car.getObject3D());
        this.startRenderingLoop();


    }

    private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.container.appendChild(this.stats.dom);
    }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this._car.update(timeSinceLastFrame);
        this.lastDate = Date.now();
    }

    /* tslint.ignore:max-func-body-length*/
    private async createScene(): Promise<void> {
        this.scene = new Scene();

        this.camera = new PerspectiveCamera(
            FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        await this._car.init();
        this.camera.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
        this.camera.lookAt(this._car.position);
        this.scene.add(this._car);
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));


        // Axes : TEST to find out if the scene is working////
        this.scene.add(this.light);

        // ROUGE : Z
        this.box1 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,10),
            new THREE.MeshBasicMaterial({color: 0xFF0000})
        );
        this.box1.position.z = 5;
        this.scene.add(this.box1);

        // VERT : Y
        this.box2 = new THREE.Mesh(
            new THREE.BoxGeometry(1,10,1),
            new THREE.MeshBasicMaterial({color: 0x00FF00})
        );
        this.box2.position.y = 5;
        this.scene.add(this.box2);

        // BLEU : X
        this.box3 = new THREE.Mesh(
            new THREE.BoxGeometry(10,1,1),
            new THREE.MeshBasicMaterial({color: 0x0000FF})
        );
        this.box3.position.x = 5;
        this.scene.add(this.box3);
        //////////////////////////////////////////////////

    }

    private getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }

    private startRenderingLoop(): void {
        this.renderer = new WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        this.lastDate = Date.now();
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.update();

        this.camera.position.x = this._car.getMeshPosition().x;
        this.camera.position.z = this._car.getMeshPosition().z;

        //this.cameraService.cameraFollowCarPosition();
        //this.renderer.render(this.scene, this.cameraService.getCamera());
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    }

    public onResize(): void {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    // TODO: Create an event handler service.
    public handleKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._car.isAcceleratorPressed = true;
                break;
            case LEFT_KEYCODE:
                this._car.steerLeft();
                break;
            case RIGHT_KEYCODE:
                this._car.steerRight();
                break;
            case BRAKE_KEYCODE:
                this._car.brake();
                break;
            default:
                break;
        }
    }

    // TODO: Create an event handler service.
    public handleKeyUp(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._car.isAcceleratorPressed = false;
                break;
            case LEFT_KEYCODE:
            case RIGHT_KEYCODE:
                this._car.releaseSteering();
                break;
            case BRAKE_KEYCODE:
                this._car.releaseBrakes();
                break;
            default:
                break;
        }
    }
}
