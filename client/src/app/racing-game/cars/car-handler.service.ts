import { Injectable } from '@angular/core';
import { Car } from './car/car';
import { PLAYERS_NAME } from "../constants";
@Injectable()
export class CarHandlerService {

    private _cars: [string, Car][];
    public constructor() {
        this._cars = [];
    }

    public async initialize(): Promise<void> {
        PLAYERS_NAME.forEach((name: string) => {
            this._cars.push([name, new Car()]);
        });
        // tslint:disable-next-line
        for( let i: number = 0; i< this._cars.length; i++)
            await this._cars[i][1].init();
    }

    public get cars(): [string, Car][] {
        return this._cars;
    }

    public get carsPosition(): [string, THREE.Vector3][] {
        const carsPosition: [string, THREE.Vector3][] = [];
        this._cars.forEach((car: [string, Car]) => {
            carsPosition.push([car[0], car[1].mesh.position]);
        });

        return carsPosition;
    }

}
