import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { WebGLRenderer, Scene, AmbientLight} from "three";

import { Car } from "../car/car";
import { CameraService } from "../camera.service";
// TODO: REMOVE : TEST_AXES
import { TestAxes } from "../test-axes";

const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.8;

@Injectable()
export class RenderService {
    private container: HTMLDivElement;
    private _car: Car;
    private renderer: WebGLRenderer;
    private scene: Scene;
    private stats: Stats;
    private lastDate: number;
    // TODO: REMOVE : TEST_AXES
    private axes: TestAxes;

    public get car(): Car {
        return this._car;
    }

    public constructor(private cameraService: CameraService) {
        this._car = new Car();
        // TODO: REMOVE : TEST_AXES
        this.axes = new TestAxes;
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
        this.container.appendChild(this.stats.dom);
    }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this._car.update(timeSinceLastFrame);
        this.lastDate = Date.now();
    }


    private async createScene(): Promise<void> {
        this.scene = new Scene();

        await this._car.init();
        this.scene.add(this._car);

        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));

        this.cameraService.initialization(this.container, this._car.getVectorPosition());
        this.cameraService.initCameras();

        // TODO: REMOVE : TEST_AXES
        this.axes.createBoxAxes();
        this.scene.add(this.axes.getBoxAxeX());
        this.scene.add(this.axes.getBoxAxeY());
        this.scene.add(this.axes.getBoxAxeZ());

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
        this.cameraService.cameraFollowCarPosition();
        this.update();
        this.renderer.render(this.scene, this.cameraService.camera);
        this.stats.update();
    }

    public onResize(): void {
        this.cameraService.camerasOnResize(this.getAspectRatio());
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    //  TODO: Create an event handler service.
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

    //  TODO: Create an event handler service.
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
