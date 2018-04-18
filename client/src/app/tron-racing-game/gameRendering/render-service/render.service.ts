import { Injectable, OnDestroy } from "@angular/core";
import _stats = require("_stats.js");
import * as THREE from "three";

import { Car } from "../../physics&interactions/cars/car/car";
import { CameraService } from "../camera.service";
import { SceneLoaderService } from "../scene-loader/scene-loader.service";
import { TrackLoaderService } from "../track-loader.service";
import { AudioService } from "../../audio/audio.service";
import { OutOfBoundsHandlerService } from "../../physics&interactions/collisions/out-of-bounds-handler.service";
import { CarHandlerService } from "../../physics&interactions/cars/car-handler.service";
import { CollisionHandlerService } from "../../physics&interactions/collisions/collision-handler.service";
import { DEFAULT_MAX_RPM } from "../../physics&interactions/cars/car/engine";
import { RaceProgressionHandlerService } from "../../raceData/raceProgression/race-progression-handler.service";
import { PortalsHandlerService } from "../../virtualPlayers/teleportation/portals-handler.service";
import { InputHandlerService } from "../../physics&interactions/controller/input-handler.service";
import { C_KEYCODE, PLUS_KEYCODE, MINUS_KEYCODE, N_KEYCODE } from "../../../../../../common/constants";
import { SkyboxService } from "../skybox.service";
import { USERNAME} from "../../constants";

const CAR_ENGINE_SOUND: string = "../../../assets/audio/RG/car-engine.wav";
const ENGINE_MIN_VOLUME: number = 0.2;
const ENGINE_MAX_VOLUME: number = 0.65;

@Injectable()
export class RenderService implements OnDestroy {
    private _container: HTMLDivElement;
    private _renderer: THREE.WebGLRenderer;
    private _scene: THREE.Scene;
    private _stats: _stats;
    private _lastDate: number;
    private _destroyed: boolean = false;
    private _car: Car;

    public ngOnDestroy(): void {
        this._destroyed = true;
        this.audioService.stopAllSounds();
    }

    public constructor(private cameraService: CameraService,
                       private sceneLoaderService: SceneLoaderService,
                       private trackLoaderService: TrackLoaderService,
                       private audioService: AudioService,
                       private carHandlerService: CarHandlerService,
                       private raceProgressionService: RaceProgressionHandlerService,
                       private collisionHandlerService: CollisionHandlerService,
                       private outOfBoundsHandlerService: OutOfBoundsHandlerService,
                       private portalhandlerService: PortalsHandlerService,
                       private inputHandler: InputHandlerService,
                       private skyboxService: SkyboxService) {
        this._car = new Car();
    }

    public get car(): Car {
        return this._car;
    }

    public async initialize(_container: HTMLDivElement): Promise<void> {
        try {
            this._car = this.carHandlerService.getCar(USERNAME);
            this.collisionHandlerService.initialize(this.carHandlerService.carsOnly);
            this.outOfBoundsHandlerService.initialize();
            this._container = _container;
            await this.createScene();
            this.portalhandlerService.initialize(this._scene);
            this.initStats();
            this.startRenderingLoop();
            this._destroyed = false;
            this.raceProgressionService.user.endOfRace$.subscribe(() => {
                this.ngOnDestroy();
            });
        } catch (error) {
            console.error("could not initialize render service");
            console.error(error);
        }
    }

    private initStats(): void {
        this._stats = new _stats();
        this._stats.dom.style.position = "absolute";
        this._stats.dom.style.top = "initial";
        this._stats.dom.style.bottom = "0px";
        this._container.appendChild(this._stats.dom);
    }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this._lastDate;
        this.carHandlerService.update(timeSinceLastFrame);

        this.outOfBoundsHandlerService.update();
        this.collisionHandlerService.update();

        const carEngineVolume: number = Math.max(ENGINE_MIN_VOLUME, Math.min(ENGINE_MAX_VOLUME, this._car.rpm / DEFAULT_MAX_RPM));
        this.audioService.playSound(CAR_ENGINE_SOUND, carEngineVolume, true);

        this.raceProgressionService.update();

        this._lastDate = Date.now();
    }

    private async createScene(): Promise<void> {
        this._scene = new THREE.Scene();
        this.carHandlerService.carsOnly.forEach((car: Car) => {
            this._scene.add(car);
        });
        this.initializeServices();
    }

    private startRenderingLoop(): void {
        this.initializeRenderer();
        this._lastDate = Date.now();
        this._container.appendChild(this._renderer.domElement);
        this.render();
    }

    private render(): void {
        if (!this._destroyed) {
            requestAnimationFrame(() => this.render());
            this.update();

            this.cameraService.updatePosition();
            this._renderer.render(this._scene, this.cameraService.getCamera());
        }
        this._stats.update();
    }

    public onResize(): void {
        this._renderer.setSize(this._container.clientWidth, this._container.clientHeight);
    }

    private changeCamera(cameraService: CameraService): Function {
        return (isKeyDown: boolean) => {
            if (isKeyDown) {
                cameraService.changeCamera();
            }
        };
    }

    private zoomIn(cameraService: CameraService): Function {
        return (isKeyDown: boolean) => {
            cameraService.isZoomingIn = isKeyDown;
        };
    }

    private zoomOut(cameraService: CameraService): Function {
        return (isKeyDown: boolean) => {
            cameraService.isZoomingOut = isKeyDown;
        };
    }

    private switchNightAndDay(skyboxService: SkyboxService, carHandler: CarHandlerService): Function {
        return (isKeyDown: boolean) => {
            if (isKeyDown) {
                skyboxService.updateScene();
                for ( const car of carHandler.carsOnly) {
                    car.switchLights();
                }
            }
        };
    }

    private initializeRenderer(): void {
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setPixelRatio(devicePixelRatio);
        this._renderer.setSize(this._container.clientWidth, this._container.clientHeight);

    }

    private initializeServices(): void {
        this.cameraService.initialize(this._container, this._car.mesh);
        this.initializeController();
        this.sceneLoaderService.initialize(this._scene);
        this.audioService.initialize(this.cameraService.getCamera());
        this.trackLoaderService.initialize(this._scene);
        this.cameraService.updatePosition();
    }

    private initializeController(): void {
        this.inputHandler.addListener(C_KEYCODE, this.changeCamera(this.cameraService));
        this.inputHandler.addListener(PLUS_KEYCODE, this.zoomIn(this.cameraService));
        this.inputHandler.addListener(MINUS_KEYCODE, this.zoomOut(this.cameraService));
        this.inputHandler.addListener(N_KEYCODE, this.switchNightAndDay(this.skyboxService, this.carHandlerService));

    }
}
