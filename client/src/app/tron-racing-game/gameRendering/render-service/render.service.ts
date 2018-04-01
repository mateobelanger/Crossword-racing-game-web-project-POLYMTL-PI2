import { Injectable, OnDestroy } from "@angular/core";
import Stats = require("stats.js");
import * as THREE from "three";

import { Car } from "../../physics&interactions/cars/car/car";
import { CameraService } from "../camera.service";
import { SceneLoaderService } from "../scene-loader/scene-loader.service";
import { TrackLoaderService } from "../track-loader.service";
import { AudioService, SOUND } from "../../audio/audio.service";
import { OutOfBoundsHandlerService } from "../../physics&interactions/collisions/out-of-bounds-handler.service";
import { CarHandlerService } from "../../physics&interactions/cars/car-handler.service";
import { RaceDataHandlerService } from "../../raceData/race-data-handler.service";
import { CollisionHandlerService } from "../../physics&interactions/collisions/collision-handler.service";
import { DEFAULT_MAX_RPM } from "../../physics&interactions/cars/car/engine";
import { RaceProgressionHandlerService } from "../../raceData/raceProgression/race-progression-handler.service";

// To see the car"s point of departure
// const HELPER_AXES_SIZE: number = 500;
// const HELPER_GRID_SIZE: number = 500;


const ENGINE_MIN_VOLUME: number = 0.2;
const ENGINE_MAX_VOLUME: number = 0.75;

@Injectable()
export class RenderService implements OnDestroy {
    private container: HTMLDivElement;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;
    private destroyed: boolean = false;
    private _car: Car;

    // private axesHelper: THREE.AxisHelper = new THREE.AxisHelper(HELPER_AXES_SIZE);

    public ngOnDestroy(): void {
        this.destroyed = true;
    }

    public constructor(private cameraService: CameraService,
                       private sceneLoaderService: SceneLoaderService,
                       private trackLoaderService: TrackLoaderService,
                       private audioService: AudioService,
                       private carHandlerService: CarHandlerService,
                       private raceDataHandler: RaceDataHandlerService,
                       private raceProgressionService: RaceProgressionHandlerService,
                       private collisionHandlerService: CollisionHandlerService,
                       private outOfBoundsHandlerService: OutOfBoundsHandlerService) {
        this._car = new Car();
    }

    public get car(): Car {
        return this._car;
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        try {
            this._car = this.carHandlerService.cars[1][1];
            this.collisionHandlerService.initialize(this.carHandlerService.carsOnly);
            this.outOfBoundsHandlerService.initialize();
            this.container = container;
            await this.createScene();
            this.initStats();
            this.startRenderingLoop();
            this.destroyed = false;
            this.raceProgressionService.user.endOfRace$.subscribe(() => {
                this.ngOnDestroy();
                this.audioService.stopAllSounds();
            });
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
        this.carHandlerService.carsOnly.forEach((car: Car) => {
            car.update(timeSinceLastFrame);
        });

        this.audioService.setVolume(SOUND.ENGINE_SOUND,
                                    Math.max(ENGINE_MIN_VOLUME, Math.min(ENGINE_MAX_VOLUME, this._car.rpm / DEFAULT_MAX_RPM)));
        this.audioService.setLoop(SOUND.ENGINE_SOUND);
        // this.audioService.playSound(SOUND.ENGINE_SOUND);

        this.outOfBoundsHandlerService.handleCollisionOnTrackLimits();
        this.collisionHandlerService.handleCarCollisions();

        this.lastDate = Date.now();
        this.raceProgressionService.update();
    }

    private async createScene(): Promise<void> {
        this.scene = new THREE.Scene();

        this.carHandlerService.carsOnly.forEach((car: Car) => {
            this.scene.add(car);
        });

        this.cameraService.initialize(this.container, this._car.mesh);
        this.sceneLoaderService.initialize(this.scene);

        this.audioService.initialize(this.cameraService.getCamera());
        this.audioService.loadSounds();

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
        if (!this.destroyed) {
            requestAnimationFrame(() => this.render());
            this.update();

            this.cameraService.updatePosition();
            this.renderer.render(this.scene, this.cameraService.getCamera());
        }
        this.stats.update();
    }

    public onResize(): void {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}


