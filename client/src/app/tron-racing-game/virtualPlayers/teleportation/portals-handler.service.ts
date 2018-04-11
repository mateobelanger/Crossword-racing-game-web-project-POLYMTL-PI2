import { Injectable } from '@angular/core';
import { Portal } from './portal';
import * as THREE from "three";

@Injectable()
export class PortalsHandlerService {

  private _scene: THREE.Scene;
  public constructor() { }

  public initialize(scene: THREE.Scene): void {
    this._scene = scene;
  }

  public async spawnPortal( portalSpawnPosition: THREE.Vector3): Promise<void> {
    const  portal: Portal = new Portal(this._scene);
    portal.createPortal(portalSpawnPosition);
    portal.portalAnimation().then(() => {
      portal.destroyPortal();
    });
  }

}
