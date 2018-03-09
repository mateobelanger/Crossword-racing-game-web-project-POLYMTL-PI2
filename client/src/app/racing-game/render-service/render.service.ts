import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import * as THREE from "three";

import { Car } from "../car/car";
import { CameraService } from "../camera.service";
import { SkyboxService } from "../skybox.service";
// ***
import { TracksProxyService } from "../tracks-proxy.service";
import { PlaneHandler } from "../track/trackBuildingBlocks/planeHandler";
import { Waypoint } from "../track/trackData/waypoint";
import { ITrackData } from "../../../../../common/trackData";



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
// ***
const X: number = 0;
const Y: number = 1;
const Z: number = 2;

const SCENE_SCALE: number = 100;

@Injectable()
export class RenderService {
    private container: HTMLDivElement;
    private _car: Car;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;

    private _waypoints: Waypoint[];
    private planeHandler: PlaneHandler;

    // To see the car's point of departure
    private axesHelper: THREE.AxisHelper = new THREE.AxisHelper( HELPER_AXES_SIZE );
    private gridHelper: THREE.GridHelper = new THREE.GridHelper( HELPER_GRID_SIZE, HELPER_GRID_SIZE );

    public get car(): Car {
        return this._car;
    }

    public constructor(private cameraService: CameraService,
                       private skyboxService: SkyboxService,
                       private tracksProxyService: TracksProxyService ) {
        this._car = new Car();
        // ***
        this._waypoints = [];
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this.container = container;
        }
        // ***try catch
        await this.tracksProxyService.initialize();
        this.setWaypointsFromProxy();

        await this.createScene();
        this.initStats();
        this.startRenderingLoop();
    }
    // ***
    private setWaypointsFromProxy(): void {

        const track: ITrackData = this.tracksProxyService.findTrack( "test" /*this.route.snapshot.paramMap.get("trackName")*/);
        if (track === undefined) {
                throw new Error("track not found");
        }

        track.waypoints.forEach( (element) => {

            const waypoint: Waypoint = new Waypoint();
            const scaledVector: THREE.Vector3 = new THREE.Vector3(element[X], element[Y], element[Z]);
            scaledVector.normalize();
            scaledVector.multiplyScalar(SCENE_SCALE);
            waypoint.position =  scaledVector;
            this._waypoints.push(waypoint);
        });

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

    private async createScene(): Promise<void> {
        this.scene = new THREE.Scene();

        // ***
        this.addTrackToScene();

        await this._car.init();
        this.scene.add(this._car);

        this.scene.add(new THREE.AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));

        this.cameraService.initialize(this.container, this._car.mesh);

        // To see the car's point of departure
        this.scene.add(this.axesHelper);
        this.scene.add(this.gridHelper);

        this.skyboxService.initialize(this.scene);
        this.skyboxService.generateSkybox();
    }

    private addTrackToScene(): void {
        this.planeHandler = new PlaneHandler(this.scene);
        this.planeHandler.generatePlanes(this._waypoints, true);
        const waypoints: Waypoint[] = [this._waypoints[this._waypoints.length - 1], this._waypoints[0]];
        this.planeHandler.generatePlanes(waypoints, true);
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
}
