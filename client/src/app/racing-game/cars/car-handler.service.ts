import { Injectable } from '@angular/core';
import { Car } from './car/car';
import { PLAYERS_NAME } from "../constants";
@Injectable()
export class CarHandlerService {

  private _cars: [string, Car][];
  public constructor() {
    this._cars = [];
  }

  public initialize(): void {
    PLAYERS_NAME.forEach( (name: string) => {
      this._cars.push([name, new Car()]);
    });
  }

  public get cars(): [string, Car][] {
    return this._cars;
  }

}
