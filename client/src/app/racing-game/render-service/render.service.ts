import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import * as THREE from 'three';

import { Car } from "../car/car";
import { CameraService, ORTHOGRAPHIC_FIELD_OF_VIEW, ORTHOGRAPHIC_CAMERA_FAR_PLANE, ORTHOGRAPHIC_CAMERA_NEAR_PLANE} from "../camera.service";
import { SkyboxService } from '../skybox.service';
import { LAND_WIDTH, LAND_HEIGHT, BACKGROUND_PLANE_POSITION_Y } from "../constants";


const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d
const CAMERA_KEYCODE: number = 67;      // c

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.8;

// To see the car's point of departure
const HELPER_AXES_SIZE: number = 500;
const HELPER_GRID_SIZE: number = 50;

@Injectable()
export class RenderService {
    private container: HTMLDivElement;
    private _car: Car;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;
    private backgroundPlane: THREE.Mesh;
    private directionalLight: THREE.DirectionalLight;

    // To see the car's point of departure
    private axesHelper: THREE.AxisHelper = new THREE.AxisHelper( HELPER_AXES_SIZE );
    private gridHelper: THREE.GridHelper = new THREE.GridHelper( HELPER_GRID_SIZE, HELPER_GRID_SIZE );

    public get car(): Car {
        return this._car;
    }

    public constructor(private cameraService: CameraService,
                       private skyboxService: SkyboxService ) {
        this._car = new Car();
        this._car.receiveShadow = true;
        this.backgroundPlane = null;
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this.container = container;
        }

        await this.createScene();
        this.initStats();
        this.startRenderingLoop();
        this.generateBackgroundView();
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

        await this._car.init();
        this.scene.add(this._car);

        this.cameraService.initialize(this.container, this._car.mesh);

        this.createDirectionalLight();

        // To see the car's point of departure
        this.scene.add(this.axesHelper);
        this.scene.add(this.gridHelper);

        this.skyboxService.initialize(this.scene);
        this.skyboxService.generateSkybox();
    }

    /*
        this.directionalLight.shadow.camera.near = ORTHOGRAPHIC_CAMERA_NEAR_PLANE;
        this.directionalLight.shadow.camera.far = ORTHOGRAPHIC_CAMERA_FAR_PLANE;

        this.directionalLight.shadow.camera.left = -ORTHOGRAPHIC_FIELD_OF_VIEW;
        this.directionalLight.shadow.camera.right = ORTHOGRAPHIC_FIELD_OF_VIEW;
        this.directionalLight.shadow.camera.top = ORTHOGRAPHIC_FIELD_OF_VIEW;
        this.directionalLight.shadow.camera.bottom = -ORTHOGRAPHIC_FIELD_OF_VIEW;
    */

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
        this.cameraService.updatePosition();
        // this.directionalLight.shadow.camera.position.copy(this.cameraService.orthographicCamera.position);
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

    public generateBackgroundView(): void {
        const texture: THREE.Texture = new THREE.TextureLoader().load("../../../assets/skybox/"
                                                                      + this.skyboxService.skyboxName + "/"
                                                                      + this.skyboxService.skyboxSate + "/bottom.png");

        const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide });
        this.backgroundPlane = new THREE.Mesh(new THREE.PlaneGeometry(LAND_WIDTH, LAND_HEIGHT), material);
        this.backgroundPlane.position.y = BACKGROUND_PLANE_POSITION_Y;

        const axis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
        // tslint:disable-next-line:no-magic-numbers
        this.backgroundPlane.rotateOnAxis(axis, Math.PI / 2);
        this.backgroundPlane.receiveShadow = true;

        this.scene.add(this.backgroundPlane);
      }

    private createDirectionalLight(): void {
        this.directionalLight = new THREE.DirectionalLight(WHITE, AMBIENT_LIGHT_OPACITY);
        this.directionalLight.castShadow = true;
        this.directionalLight.position.set( 0, 500, 500 );
        this.directionalLight.shadow.camera.visible = true;

        this.directionalLight.shadow.mapSize.width = 512*8;
        this.directionalLight.shadow.mapSize.height = 512*8;

        this.directionalLight.shadow.camera.near = ORTHOGRAPHIC_CAMERA_NEAR_PLANE*5;
        this.directionalLight.shadow.camera.far = ORTHOGRAPHIC_CAMERA_FAR_PLANE*5;

        this.directionalLight.shadow.camera.left = -ORTHOGRAPHIC_FIELD_OF_VIEW*5;
        this.directionalLight.shadow.camera.right = ORTHOGRAPHIC_FIELD_OF_VIEW*5;
        this.directionalLight.shadow.camera.top = ORTHOGRAPHIC_FIELD_OF_VIEW*5;
        this.directionalLight.shadow.camera.bottom = -ORTHOGRAPHIC_FIELD_OF_VIEW*5;

        this.scene.add(this.directionalLight);
      }
}
