import { TestBed, inject } from '@angular/core/testing';

import { CameraService, ORTHOGRAPHIC_INITIAL_POSITION_Y } from './camera.service';
import { Car } from './car/car';
import { Object3D } from 'three';
import { Engine } from './car/engine';

const MS_BETWEEN_FRAMES: number = 16.6667;

/* tslint:disable: no-magic-numbers */
class MockEngine extends Engine {
  public getDriveTorque(): number {
      return 10000;
  }
}

describe('CameraService', () => {

  const dummyElement: HTMLDivElement = document.createElement('div');
  const cameraService: CameraService = new CameraService();
  let car: Car;
  let target: Object3D = new Object3D();

  beforeEach(async (done: () => void) => {
    TestBed.configureTestingModule({
      providers: [CameraService]
    });
    car = new Car(new MockEngine());
    await car.init();

    car.isAcceleratorPressed = true;
    car.update(MS_BETWEEN_FRAMES);
    car.isAcceleratorPressed = false;

    target = car.mesh;
    cameraService.initialize(dummyElement, target);

    done();
  });

  it('should be created', inject([CameraService], (service: CameraService) => {
    expect(service).toBeTruthy();
  }));

  it('should have a target defined', () => {
    expect(target).toBeTruthy();
  });

  it('should have the same initial position for perpective camera and target', () => {
    // TODO : verify
    expect(cameraService.perspectiveCamera.position.x).toBeCloseTo(target.position.x);
    expect(cameraService.perspectiveCamera.position.y).toBeCloseTo(target.position.y);
    expect(cameraService.perspectiveCamera.position.z).toBeCloseTo(target.position.z);
  });

  it('should have the same initial position for orthographic camera and target', () => {
    // TODO : verify
    expect(cameraService.orthographicCamera.position.x).toBeCloseTo(target.position.x);
    expect(cameraService.orthographicCamera.position.y).toBeCloseTo(ORTHOGRAPHIC_INITIAL_POSITION_Y);
    expect(cameraService.orthographicCamera.position.z).toBeCloseTo(target.position.z);
  });

  it('moving', () => {
    // TODO : add some tests 
    /*
    car.isAcceleratorPressed = true;
    car.update(MS_BETWEEN_FRAMES);
    car.isAcceleratorPressed = false;

    expect(cameraService.perspectiveCamera.position.x).toBeCloseTo(target.position.x);
    expect(cameraService.perspectiveCamera.position.z).toBeCloseTo(target.position.z);*/
  });



});
