import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import * as THREE from "three";

import { Car } from "../car/car";
import { CameraService } from "../camera.service";
import { SkyboxService } from "../skybox.service";
import { LoadingTrackHandlerService } from "../loading-track-handler.service";


const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d
const CAMERA_KEYCODE: number = 67;      // c

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.8;

// To see the car"s point of departure
const HELPER_AXES_SIZE: number = 500;
const HELPER_GRID_SIZE: number = 50;

@Injectable()
export class RenderService {
    private container: HTMLDivElement;
    private _car: Car;

    // ***
    private _carForCollision: Car;
    private _carForCollision2: Car;
    // ***
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;

    // To see the car's point of departure
    private axesHelper: THREE.AxisHelper = new THREE.AxisHelper(HELPER_AXES_SIZE);
    private gridHelper: THREE.GridHelper = new THREE.GridHelper(HELPER_GRID_SIZE, HELPER_GRID_SIZE);

    public get car(): Car {
        return this._car;
    }

    public constructor( private cameraService: CameraService,
                        private skyboxService: SkyboxService,
                        private loadingTrackHandlerService: LoadingTrackHandlerService) {
        this._car = new Car();

        // ***
        this._carForCollision = new Car();
        this._carForCollision2 = new Car();
        // ***

    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this.container = container;
        }

        await this.createScene();
        this.initStats();
        this.startRenderingLoop();
    }

    private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.stats.dom.style.top = 'initial';
        this.stats.dom.style.bottom = '0px';
        this.container.appendChild(this.stats.dom);
    }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        const helper: THREE.BoxHelper = new THREE.BoxHelper(this._car.mesh, new THREE.Color(0xFF0000));
        this.scene.add(helper);
        this._car.update(timeSinceLastFrame);
        this._carForCollision.update(timeSinceLastFrame);
        this.lastDate = Date.now();
    }

    private async createScene(): Promise<void> {
        this.scene = new THREE.Scene();

        await this._car.init();
        this.scene.add(this._car);

        this.scene.add(new THREE.AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));

        this.cameraService.initialize(this.container, this._car.mesh);

        // To see the car's point of departure
        this.scene.add(this.axesHelper);
        this.scene.add(this.gridHelper);

        this.skyboxService.initialize(this.scene);
        this.skyboxService.generateSkybox();

        // ***
        await this._carForCollision.init();
        this._carForCollision.setPosition(new THREE.Vector3(-20, 0, 0));
        this.scene.add(this._carForCollision);

        await this._carForCollision2.init();
        this._carForCollision2.setPosition(new THREE.Vector3(-60, 0, 0));
        this.scene.add(this._carForCollision2);
        // ***

        this._carForCollision.box.setFromObject(this._carForCollision.mesh);
        // ***

        this.loadingTrackHandlerService.initialize(this.scene);

        // const helper: THREE.BoxHelper = new THREE.BoxHelper(this._car.mesh, new THREE.Color(0xFF0000));
        // this.scene.add(helper);
    }

    private startRenderingLoop(): void {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.lastDate = Date.now();
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.cameraService.updatePosition();
        this.update();

        if (this._car.box.intersectsBox(this._carForCollision.box)) {
            console.log("collision");
            this.carCollision(this._car, this._carForCollision);
        }

        this.renderer.render(this.scene, this.cameraService.getCamera());
        this.stats.update();
    }

    public onResize(): void {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    // Create an event handler service.
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

    // Create an event handler service.
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
            case CAMERA_KEYCODE:
                this.cameraService.changeCamera();
                break;
            default:
                break;
        }
    }

    private carCollision(car1: Car, car2: Car): void {
        const temp: THREE.Vector3 = car2.speed.clone();
        car1.speed = car2.speed;
        car2.speed = temp;
    }
}
