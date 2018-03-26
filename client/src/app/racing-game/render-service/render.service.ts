import { Injectable, OnDestroy } from "@angular/core";
import Stats = require("stats.js");
import * as THREE from "three";

import { Car } from "../cars/car/car";
import { CameraService } from "../camera.service";

import { EndGameService } from "../end-game/end-game.service";
import { SceneLoaderService } from "../scene-loader/scene-loader.service";
import { TrackLoaderService } from "../track-loader.service";
import { AudioService, SOUND } from "../audio/audio.service";
import { CarHandlerService } from "../cars/car-handler.service";
import { RaceDataHandlerService } from "../race-data-handler.service";
import { CollisionHandlerService } from "../collisions/collision-handler.service";
import { DEFAULT_MAX_RPM } from "../cars/car/engine";


const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d
const CAMERA_KEYCODE: number = 67;      // c
const SCENE_STATE_KEYCODE: number = 78; // n
const END_GAME: number = 69;            // e

const ENGINE_MIN_VOLUME: number = 0.20;
const ENGINE_MAX_VOLUME: number = 0.75;

@Injectable()
export class RenderService implements OnDestroy {
    private container: HTMLDivElement;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;
    private destroyed: boolean = false;

    // private axesHelper: THREE.AxisHelper = new THREE.AxisHelper(HELPER_AXES_SIZE);

    public ngOnDestroy(): void {
        this.destroyed = true;
    }
    public get car(): Car {
        return this.carHandlerService.cars[0][1];
    }

    public constructor(private cameraService: CameraService,
                       private sceneLoaderService: SceneLoaderService,
                       private trackLoaderService: TrackLoaderService,
                       private audioService: AudioService,
                       private endGameService: EndGameService,
                       private carHandlerService: CarHandlerService,
                       private raceDataHandler: RaceDataHandlerService,
                       private collisionHandlerService: CollisionHandlerService) {
        this.carHandlerService.initialize();
        this.collisionHandlerService.initialize(carHandlerService.carsOnly);
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        try {
            this.container = container;
            await this.createScene();
            this.initStats();
            this.startRenderingLoop();
            this.destroyed = false;
        } catch (err) {
            console.error("could not initilize render service");
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
        this.carHandlerService.carsOnly.forEach((car: Car) => {
            car.update(timeSinceLastFrame);
        });

        this.audioService.setVolume(SOUND.ENGINE_SOUND, Math.max(ENGINE_MIN_VOLUME, Math.min(ENGINE_MAX_VOLUME, this.car.rpm / DEFAULT_MAX_RPM)));
        this.audioService.setLoop(SOUND.ENGINE_SOUND);
        this.audioService.playSound(SOUND.ENGINE_SOUND);

        this.lastDate = Date.now();
        this.raceDataHandler.update();
    }

    private async createScene(): Promise<void> {
        this.scene = new THREE.Scene();

        this.carHandlerService.carsOnly.forEach((car: Car) => {
            this.scene.add(car);
        });

        this.cameraService.initialize(this.container, this.car.mesh);
        this.sceneLoaderService.initialize(this.scene);

        this.audioService.initialize(this.cameraService.getCamera());
        this.audioService.loadSounds();

        this.trackLoaderService.initialize(this.scene);
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
        if (!this.destroyed) {
            requestAnimationFrame(() => this.render());
            this.update();

            this.collisionHandlerService.handleCarCollisions();

            this.cameraService.updatePosition();
            this.renderer.render(this.scene, this.cameraService.getCamera());
        }
        this.stats.update();
    }

    public onResize(): void {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    // Create an event handler service.
    public handleKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this.car.isAcceleratorPressed = true;
                break;
            case LEFT_KEYCODE:
                this.car.steerLeft();
                break;
            case RIGHT_KEYCODE:
                this.car.steerRight();
                break;
            case BRAKE_KEYCODE:
                this.car.brake();
                break;
            default:
                break;
        }
    }

    // Create an event handler service.
    public handleKeyUp(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this.car.isAcceleratorPressed = false;
                break;
            case LEFT_KEYCODE:
            case RIGHT_KEYCODE:
                this.car.releaseSteering();
                break;
            case BRAKE_KEYCODE:
                this.car.releaseBrakes();
                break;
            case CAMERA_KEYCODE:
                this.cameraService.changeCamera();
                break;
            case SCENE_STATE_KEYCODE:
                this.sceneLoaderService.updateScene();
                this.car.switchLights();
                break;
            case END_GAME:
                this.endGameService.displayResultTable();
                break;
            default:
                break;
        }
    }

}


