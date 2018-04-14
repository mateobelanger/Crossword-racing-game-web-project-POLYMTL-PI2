import { TestBed, inject } from "@angular/core/testing";
import * as THREE from "three";

import { CameraService, ORTHOGRAPHIC_INITIAL_POSITION_Y,
         PERSPECTIVE_INITIAL_POSITION_Y, PERSPECTIVE_INITIAL_POSITION_Z,
         CAMERA_INITIAL_ZOOM, CAMERA_MIN_ZOOM, CAMERA_MAX_ZOOM} from "./camera.service";
import { Car } from "../physics&interactions/cars/car/car";
import { Engine } from "../physics&interactions/cars/car/engine";

const DELTA_X: number = 100;
const DELTA_Z: number = 200;
const PERSPECTIVE_CAMERA: string = "PerspectiveCamera";
const ORTHOGRAPHIC_CAMERA: string = "OrthographicCamera";

class MockEngine extends Engine {
    public getDriveTorque(): number {
        // tslint:disable-next-line:no-magic-numbers
        return 10000;
    }
}

describe("CameraService", () => {

    const dummyElement: HTMLDivElement = document.createElement("div");

    let cameraService: CameraService;
    let car: Car;
    let target: THREE.Object3D = new THREE.Object3D();
    let initialCamera: THREE.Camera = new THREE.Camera();


    beforeEach(async (done: () => void) => {
        TestBed.configureTestingModule({
            providers: [CameraService]
        });
        car = new Car(new MockEngine());
        await car.init();

        target = car.mesh;

        cameraService = new CameraService();
        cameraService.initialize(dummyElement, target);

        initialCamera = cameraService.getCamera();

        done();
    });

    it("should be created", inject([CameraService], (service: CameraService) => {
        expect(service).toBeTruthy();
    }));

    it("should have a target defined", () => {
        expect(target).toBeTruthy();
    });

    it("should have the same initial position for perpective camera and target", () => {
        expect(cameraService.perspectiveCamera.position.x).toBe(target.position.x);
        expect(cameraService.perspectiveCamera.position.y).toBe(target.position.y);
        expect(cameraService.perspectiveCamera.position.z).toBe(target.position.z);
    });

    it("should have the same initial position for orthographic camera and target", () => {
        expect(cameraService.orthographicCamera.position.x).toBe(target.position.x);
        expect(cameraService.orthographicCamera.position.y).toBe(ORTHOGRAPHIC_INITIAL_POSITION_Y);
        expect(cameraService.orthographicCamera.position.z).toBe(target.position.z);
    });


    it("should have the expected position after car moved for perspective camera and target", () => {
        car.mesh.position.x = DELTA_X;
        car.mesh.position.z = DELTA_Z;
        car.update(1);

        cameraService.updatePosition();

        const relativeCameraOffset: THREE.Vector3 = new THREE.Vector3(0, PERSPECTIVE_INITIAL_POSITION_Y, PERSPECTIVE_INITIAL_POSITION_Z);
        const cameraOffset: THREE.Vector3 = relativeCameraOffset.applyMatrix4(target.matrix);

        expect(cameraService.perspectiveCamera.position.x).toBe(cameraOffset.x);
        expect(cameraService.perspectiveCamera.position.z).toBe(cameraOffset.z);
    });

    it("should have the same position after car moved for orthographic camera and target", () => {
        car.mesh.position.x = DELTA_X;
        car.mesh.position.z = DELTA_Z;
        car.update(1);

        cameraService.updatePosition();

        expect(cameraService.orthographicCamera.position.x).toBe(DELTA_X);
        expect(cameraService.orthographicCamera.position.z).toBe(DELTA_Z);
    });

    it("should change camera when camera is changed once ", () => {
        cameraService.changeCamera();

        if (initialCamera.type === PERSPECTIVE_CAMERA) {
            expect(cameraService.getCamera().type).toBe(ORTHOGRAPHIC_CAMERA);
        } else {
            expect(cameraService.getCamera().type).toBe(PERSPECTIVE_CAMERA);
        }
    });

    it("should comeback to initial camera when camera is changed twice ", () => {
        cameraService.changeCamera();
        cameraService.changeCamera();

        if (initialCamera.type === PERSPECTIVE_CAMERA) {
            expect(cameraService.getCamera().type).toBe(PERSPECTIVE_CAMERA);
        } else {
            expect(cameraService.getCamera().type).toBe(ORTHOGRAPHIC_CAMERA);
        }
    });

    it("should zoom in properly ", () => {
        cameraService.zoomIn();
        expect(cameraService["zoomFactor"]).toBeGreaterThan(CAMERA_INITIAL_ZOOM);
    });

    it("should zoom out properly ", () => {
        cameraService.zoomIn();
        cameraService.zoomIn();
        cameraService.zoomOut();
        cameraService.zoomOut();
        expect(cameraService["zoomFactor"]).toBe(CAMERA_INITIAL_ZOOM);
    });

    it("should have a maximum zoom", () => {
        // tslint:disable-next-line:no-magic-numbers
        for (let i: number = 0; i < 100; i++) {
            cameraService.zoomIn();
        }
        expect(cameraService["zoomFactor"]).toBeCloseTo(CAMERA_MAX_ZOOM);
    });

    it("should have a minimum zoom", () => {
        // tslint:disable-next-line:no-magic-numbers
        for (let i: number = 0; i < 100; i++) {
            cameraService.zoomOut();
        }
        expect(cameraService["zoomFactor"]).toBeCloseTo(CAMERA_MIN_ZOOM);
    });

});
