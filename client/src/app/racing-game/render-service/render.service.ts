import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import * as THREE from "three";

import { Car } from "../cars/car/car";
import { CameraService } from "../camera.service";
import { EndGameService } from "../end-game/end-game.service";
import { SceneLoaderService } from "../scene-loader/scene-loader.service";
import { TrackLoaderService } from "../track-loader.service";
import { AudioService } from "../audio/audio.service";
import { OutOfBoundsHandlerService } from "../collisions/out-of-bounds-handler.service";
import { CarHandlerService } from "../cars/car-handler.service";



const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d
const CAMERA_KEYCODE: number = 67;      // c
const SCENE_STATE_KEYCODE: number = 78; // n
const END_GAME: number = 69;            // e


// To see the car"s point of departure
const HELPER_AXES_SIZE: number = 500;
//const HELPER_GRID_SIZE: number = 500;


@Injectable()
export class RenderService {
    private container: HTMLDivElement;
    private _car: Car;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;


    // To see the car's point of departure
    private axesHelper: THREE.AxisHelper = new THREE.AxisHelper(HELPER_AXES_SIZE);

    public get car(): Car {
        return this._car;
    }

    public constructor(private cameraService: CameraService,
                       private sceneLoaderService: SceneLoaderService,
                       private trackLoaderService: TrackLoaderService,
                       private audioService: AudioService,
                       private endGameService: EndGameService,
                       private outOfBoundsHandlerService: OutOfBoundsHandlerService,
                       private carHandlerService: CarHandlerService) {
        this._car = new Car();
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        try {
            this._car = this.carHandlerService.cars[0][1];
            this.container = container;
            await this.createScene();
            this.initStats();
            this.startRenderingLoop();
        } catch (err) {
            console.error("could not initialize render service");
            console.error(err);
        }
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
        this._car.update(timeSinceLastFrame);
        this.outOfBoundsHandlerService.handleCollisionOnTrackLimits();
        this.lastDate = Date.now();
    }

    private async createScene(): Promise<void> {
        this.scene = new THREE.Scene();

        this.scene.add(this._car);
        // To see the car's point of departure
        this.scene.add(this.axesHelper);
        //this.scene.add(this.gridHelper);

        this.cameraService.initialize(this.container, this._car.mesh);
        this.sceneLoaderService.initialize(this.scene);

        this.audioService.initialize(this.cameraService.getCamera());
        this.trackLoaderService.initialize(this.scene);

        this.cameraService.updatePosition();

    }


    private startRenderingLoop(): void {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.lastDate = Date.now();
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.update();
        this.cameraService.updatePosition();
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
            case SCENE_STATE_KEYCODE:
                this.sceneLoaderService.updateScene();
                this._car.switchLights();
                break;
            case END_GAME:
                this.endGameService.displayResultTable();
                break;
            default:
                break;
        }
    }
}


