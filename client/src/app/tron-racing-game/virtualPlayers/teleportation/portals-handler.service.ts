import { Injectable } from '@angular/core';
import { Portal } from './portal';
import * as THREE from "three";
import { Car } from '../../physics&interactions/cars/car/car';

@Injectable()
export class PortalsHandlerService {

    private _scene: THREE.Scene;
    public constructor() { }

    public initialize(scene: THREE.Scene): void {
        this._scene = scene;
    }

    public async teleport(car: Car, endPosition: THREE.Vector3): Promise<void> {
        if (this.isDefined(this._scene)) {
            await this.enterPortal(car);
            await this.exitPortal(car, endPosition);
        }
    }

    private async enterPortal(car: Car): Promise<void> {
        const portal: Portal = new Portal(this._scene);
        portal.createPortal(car.mesh.position);
        await portal.growPortal();
        car.visible = false;
        await portal.shrinkPortal();
        portal.destroyPortal();
    }

    private async exitPortal(car: Car, endPosition: THREE.Vector3): Promise<void> {
        const portal: Portal = new Portal(this._scene);
        portal.createPortal(endPosition);
        await portal.growPortal();
        car.mesh.position.set(endPosition.x, endPosition.y, endPosition.z);
        car.visible = true;
        await portal.shrinkPortal();
        portal.destroyPortal();
    }

    // tslint:disable:no-any
    private isDefined(object: any): boolean {
        return ((object !== null) && (object !== undefined));
    }// tslint:enable:no-any

}
