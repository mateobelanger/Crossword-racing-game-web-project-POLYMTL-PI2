import { Injectable } from '@angular/core';
import { PerspectiveCamera, OrthographicCamera, Camera, Object3D } from 'three';


const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const INITIAL_CAMERA_POSITION_Y: number = 25;


enum CameraType { PERSPECTIVE, ORTHOGRAPHIC }

@Injectable()
export class CameraService {


  private container: HTMLElement;

  private camera: CameraType;

  public orthographicCamera: OrthographicCamera;

  public perspectiveCamera: PerspectiveCamera;

  public carToFollow: THREE.Object3D;



  constructor() {
      this.camera = CameraType.ORTHOGRAPHIC;
   }

  public changeCamera(): void {
      if (this.camera === CameraType.PERSPECTIVE) {
          this.camera = CameraType.ORTHOGRAPHIC;
      }
      else {
          this.camera = CameraType.PERSPECTIVE;
      }
  }

  public getCamera(): Camera {
      return this.camera === CameraType.ORTHOGRAPHIC ? this.orthographicCamera : this.perspectiveCamera;
  }

  private getAspectRatio(): number {
    return this.container.clientWidth / this.container.clientHeight;
  }

  public initialize(container: HTMLElement, carToFollow: Object3D): void {
      if (container) {
          this.container = container;
      }
      this.initCameras(carToFollow);
  }

  private initCameras(carToFollow: Object3D): void {

      this.carToFollow = carToFollow;

      this.orthographicCamera = new OrthographicCamera (
          this.container.clientWidth / - 2,
          this.container.clientWidth / 2,
          this.container.clientHeight / 2,
          this.container.clientHeight / - 2,
          1,  
          100
      );



      this.orthographicCamera.position.x = this.carToFollow.position.x;
      this.orthographicCamera.position.y = INITIAL_CAMERA_POSITION_Y;
      this.orthographicCamera.position.z = this.carToFollow.position.z;

      this.orthographicCamera.lookAt(this.carToFollow.position);
      

      this.perspectiveCamera = new PerspectiveCamera (
          FIELD_OF_VIEW,
          this.getAspectRatio(),
          NEAR_CLIPPING_PLANE,
          FAR_CLIPPING_PLANE
      );
      /*INITIALIZE PERSPECTIVE CAMERA'S POSITION */
      this.perspectiveCamera.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
      this.perspectiveCamera.lookAt(this.carToFollow.position);
  }

  public cameraFollowCarPosition(): void {
      this.orthographicCamera.position.x = this.carToFollow.position.x;
      this.orthographicCamera.position.z = this.carToFollow.position.z;
      this.orthographicCamera.rotation.z = this.carToFollow.rotation.y;
      this.perspectiveCamera.lookAt(this.carToFollow.position);
  }

}
