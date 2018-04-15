// export class Renderer {
//     private container: HTMLDivElement;
//     private renderer: THREE.WebGLRenderer;
//     private scene: THREE.Scene;

//     public constructor() {
//         this.container = null;
//         this.renderer = null;
//         this.scene = null;
//     }

//     public initialize(container: HTMLDivElement): void {
//         this.container = container;
//         this.createScene();
//         this.startRenderingLoop();
//     }

//     public async initialize(container: HTMLDivElement): Promise<void> {
//         try {
//             this._car = this.carHandlerService.cars[1][1];
//             this.collisionHandlerService.initialize(this.carHandlerService.carsOnly);
//             this.outOfBoundsHandlerService.initialize();
//             this.container = container;
//             await this.createScene();
//             this.portalhandlerService.initialize(this.scene);
//             this.initStats();
//             this.startRenderingLoop();
//             this.destroyed = false;
//             this.raceProgressionService.user.endOfRace$.subscribe(() => {
//                 this.ngOnDestroy();
//             });
//         } catch (err) {
//             console.error("could not initialize render service");
//             console.error(err);
//         }
//     }

//     private createScene(): void {
//         this.scene = new THREE.Scene();

//         this._raycaster = new THREE.Raycaster();
//         this._mouse = new THREE.Vector2();
//         // tslint:disable:no-magic-numbers
//         this._camera = new THREE.OrthographicCamera (
//           this.container.clientWidth / -2,
//           this.container.clientWidth / 2,
//           this.container.clientHeight / 2,
//           this.container.clientHeight / -2,
//           ORTHOGRAPHIC_CAMERA_NEAR_PLANE,
//           ORTHOGRAPHIC_CAMERA_FAR_PLANE
//         );
//         // tslint:enable:no-magic-numbers
//         this._camera.position.set(0, 0, INITIAL_CAMERA_POSITION_Z);
//         this._camera.lookAt(new THREE.Vector3(0, 0, 0));

//         this.ambientLight = new THREE.AmbientLight( AMBIENT_LIGHT_COLOR, AMBIENT_LIGHT_OPACITY);
//         this.scene.add(this.ambientLight);

//         this._circleHandler = new CircleHandler(this.scene);

//         this._planeHandler = new PlaneHandler(this.scene);

//         this._backgroundPlane = new BackgroundPlane(this.scene);

//         this._backgroundPlane.generateBackgroundPlane();

//     }

    
//     private async createScene(): Promise<void> {
//         this.scene = new THREE.Scene();

//         this.carHandlerService.carsOnly.forEach((car: Car) => {
//             this.scene.add(car);
//         });

//         this.cameraService.initialize(this.container, this._car.mesh);
//         this.sceneLoaderService.initialize(this.scene);

//         this.audioService.initialize(this.cameraService.getCamera());

//         this.trackLoaderService.initialize(this.scene);

//         this.cameraService.updatePosition();
//     }


//     private startRenderingLoop(): void {
//         this.renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
//         this.renderer.setPixelRatio(devicePixelRatio);
//         this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
//         this.container.appendChild(this.renderer.domElement);
//         this.render();
//     }


//     private startRenderingLoop(): void {
//         this.renderer = new THREE.WebGLRenderer();
//         this.renderer.setPixelRatio(devicePixelRatio);
//         this.renderer.shadowMap.enabled = true;
//         this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//         this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
//         this.lastDate = Date.now();
//         this.container.appendChild(this.renderer.domElement);
//         this.render();
//     }


//     private render(): void {
//         requestAnimationFrame(() => this.render());
//         this.renderer.render(this.scene, this._camera);
//     }

    
//     private render(): void {
//         if (!this.destroyed) {
//             requestAnimationFrame(() => this.render());
//             this.update();

//             this.cameraService.updatePosition();
//             this.renderer.render(this.scene, this.cameraService.getCamera());
//         }
//         this.stats.update();
//     }
// }






