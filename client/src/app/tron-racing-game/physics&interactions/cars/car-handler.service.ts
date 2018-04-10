import { Injectable } from '@angular/core';
import { Car } from './car/car';
import { PLAYERS_NAME, USERNAME, GameState } from "../../constants";
import * as THREE from "three";
import { CarStartPosition } from './carStartPosition';
import { VirtualPlayerController } from '../../virtualPlayers/virtualPlayerController';
import { SpeedZonesService } from '../../virtualPlayers/speed-zones.service';
import { RaceProgressionHandlerService } from '../../raceData/raceProgression/race-progression-handler.service';
import { VirtualPlayerDifficulty } from '../../virtualPlayers/virtualPlayerDifficulty';

@Injectable()
export class CarHandlerService {

    private _cars: [string, Car][];
    public constructor( private speedZoneService: SpeedZonesService,
                        private raceProgressionService: RaceProgressionHandlerService) {
        this._cars = [];
    }

    public async initialize( playerSkill: VirtualPlayerDifficulty): Promise<void> {
        PLAYERS_NAME.forEach((name: string) => {
            this._cars.push([   name,
                                name !== USERNAME ? new VirtualPlayerController(this.speedZoneService,
                                                                                this.raceProgressionService,
                                                                                name,
                                                                                playerSkill) :
                                                    new Car()]);
        });
        // because await does not work in for-of loop
        // tslint:disable prefer-for-of
        for ( let i: number = 0; i < this._cars.length; i++) {
            await this._cars[i][1].init();
        }
    }

    public get cars(): [string, Car][] {
        return this._cars;
    }

    public update(deltaTime: number): void {
        this._cars.forEach( (car: [string, Car]) => { car[1].update(deltaTime); });
    }

    public get carsOnly(): Car[] {
        const cars: Car[] = [];
        this.cars.forEach((car: [string, Car]) => {
            cars.push(car[1]);
        });

        return cars;
    }

    public get carsPosition(): [string, THREE.Vector3][] {
        const carsPosition: [string, THREE.Vector3][] = [];
        this._cars.forEach((car: [string, Car]) => {
            carsPosition.push([car[0], car[1].mesh.position]);
        });

        return carsPosition;
    }

    public moveCarsToStart(waypoints: [number, number, number ][]): void {
        const cars: Car[] = this._cars.map((car: [string, Car]) => car[1]);
        const carsPosition: CarStartPosition = new CarStartPosition( cars, waypoints);
        carsPosition.moveCarsToStart();
    }

    public startRace(): void {
        this._cars.forEach( (car: [string, Car]) => {
            car[1].changeState(GameState.RACE);
        });
    }

    public endRace(): void {
        this._cars.forEach( (car: [string, Car]) => {
            car[1].changeState(GameState.END);
        });
    }

    public virtualPlayerFinished(virtualPlayerName: string): void {
        this.findVirtualPlayer(virtualPlayerName).changeState(GameState.END);
    }

    private findVirtualPlayer(virtualPlayerName: string): Car {
        return  this._cars.filter( (car: [string, Car]) =>
                car[0] === virtualPlayerName
                )[0][1];
    }

}
