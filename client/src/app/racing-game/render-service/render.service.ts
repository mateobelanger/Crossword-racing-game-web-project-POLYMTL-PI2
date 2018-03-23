import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import * as THREE from "three";

import { Car } from "../car/car";
import { CameraService } from "../camera.service";
import { SkyboxService } from "../skybox.service";
import { CollisionHandler } from "../collisions/collisionHandler";
// import { Vector3 } from "three";
import { TrackLoaderService } from "../track-loader.service";


const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d
const CAMERA_KEYCODE: number = 67;      // c

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.8;

// To see the car"s point of departure
const HELPER_AXES_SIZE: number = 500;
// const HELPER_GRID_SIZE: number = 50;

@Injectable()
export class RenderService {
    private container: HTMLDivElement;
    // private _car: Car;
    private _cars: Car[];

    // ***
    // private _carForCollision: Car;
    // private _carForCollision2: Car;
    private collisionHandler: CollisionHandler;
    // ***
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;

    // To see the car's point of departure
    private axesHelper: THREE.AxisHelper = new THREE.AxisHelper(HELPER_AXES_SIZE);
    // private gridHelper: THREE.GridHelper = new THREE.GridHelper(HELPER_GRID_SIZE, HELPER_GRID_SIZE);

    public get car(): Car {
        return this._cars[0];
    }

    public constructor( private cameraService: CameraService,
                        private skyboxService: SkyboxService,
                        private trackLoaderService: TrackLoaderService ) {
        this._cars = [];
        this._cars.push( new Car() );

        // ***
        this._cars.push(new Car());
        this._cars.push(new Car());
        // this._carForCollision2 = new Car();
        this.collisionHandler = new CollisionHandler(this._cars);
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
        // const helper: THREE.BoxHelper = new THREE.BoxHelper(this._car.mesh, new THREE.Color(0xFF0000));
        // this.scene.add(helper);
        this._cars.forEach( (car) => {
            car.update(timeSinceLastFrame);
        });

        this.lastDate = Date.now();
    }

    private async createScene(): Promise<void> {
        this.scene = new THREE.Scene();

        // this._cars.forEach( async (car) => {
        //     await car.init();
        //     this.scene.add(car);
        // });
        await this._cars[0].init();
        this.scene.add(this._cars[0]);

        this.scene.add(new THREE.AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));

        this.cameraService.initialize(this.container, this._cars[0].mesh);

        // To see the car's point of departure
        this.scene.add(this.axesHelper);
        // this.scene.add(this.gridHelper);

        this.skyboxService.initialize(this.scene);
        this.skyboxService.generateSkybox();

        // ***
        await this._cars[1].init();
        this._cars[1].setPosition(new THREE.Vector3(-20, 0, 0));
        this.scene.add(this._cars[1]);
        this._cars[1].box.setFromObject(this._cars[1].mesh);

        await this._cars[2].init();
        this._cars[2].setPosition(new THREE.Vector3(-10, 0, 0));
        this.scene.add(this._cars[2]);
        this._cars[2].box.setFromObject(this._cars[2].mesh);

        // await this._carForCollision2.init();
        // this._carForCollision2.setPosition(new THREE.Vector3(-60, 0, 0));
        // this.scene.add(this._carForCollision2);
        // ***

        this.trackLoaderService.initialize(this.scene);
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

        this.collisionHandler.handleCarCollisions(this._cars, this.scene);

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
                this._cars[0].isAcceleratorPressed = true;
                break;
            case LEFT_KEYCODE:
                this._cars[0].steerLeft();
                break;
            case RIGHT_KEYCODE:
                this._cars[0].steerRight();
                break;
            case BRAKE_KEYCODE:
                this._cars[0].brake();
                break;
            default:
                break;
        }
    }

    // Create an event handler service.
    public handleKeyUp(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._cars[0].isAcceleratorPressed = false;
                break;
            case LEFT_KEYCODE:
            case RIGHT_KEYCODE:
                this._cars[0].releaseSteering();
                break;
            case BRAKE_KEYCODE:
                this._cars[0].releaseBrakes();
                break;
            case CAMERA_KEYCODE:
                this.cameraService.changeCamera();
                break;
            default:
                break;
        }
    }

}
