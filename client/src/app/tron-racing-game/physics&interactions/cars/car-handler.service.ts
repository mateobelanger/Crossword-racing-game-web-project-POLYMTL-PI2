import { Injectable } from "@angular/core";
import * as THREE from "three";

import { Car } from "./car/car";
import { PLAYERS_NAME, USERNAME, GameState, CAR_TEXTURE, NUMBER_OF_TEXURES } from "../../constants";
import { CarStartPosition } from "./carStartPosition";
import { VirtualPlayerCar } from "../../virtualPlayers/virtualPlayerCar";
import { SpeedZonesService } from "../../virtualPlayers/speed-zones.service";
import { RaceProgressionHandlerService } from "../../raceData/raceProgression/race-progression-handler.service";
import { VirtualPlayerDifficulty } from "../../virtualPlayers/virtualPlayerDifficulty";
import { TextureLoaderService } from "../../gameRendering/textureLoader/texture-loader.service";
import { InputHandlerService } from "../controller/input-handler.service";
import { W_KEYCODE, A_KEYCODE, S_KEYCODE, D_KEYCODE } from "../../../../../../common/constants";

@Injectable()
export class CarHandlerService {

    private _cars: [string, Car][];
    public constructor( private speedZoneService: SpeedZonesService,
                        private raceProgressionService: RaceProgressionHandlerService,
                        private textureLoader: TextureLoaderService,
                        private inputHandler: InputHandlerService) {
        this._cars = [];
    }

    public async initialize(playerSkill: VirtualPlayerDifficulty): Promise<void> {
        this.fillCarArray(playerSkill);
        await this.initializeCars();
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

    public getCar(name: string): Car {
        return this._cars.find( (car: [string, Car]) =>  car[0] === name)[1];
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

    public enableControlKeys(): void {
        this.inputHandler.addListener(W_KEYCODE, this.accelerationInput(this._cars));
        this.inputHandler.addListener(W_KEYCODE, this.accelerationInput(this._cars));

        this.inputHandler.addListener(A_KEYCODE, this.turnLeftInput(this._cars));
        this.inputHandler.addListener(A_KEYCODE, this.turnLeftInput(this._cars));

        this.inputHandler.addListener(S_KEYCODE, this.brakeInput(this._cars));
        this.inputHandler.addListener(S_KEYCODE, this.brakeInput(this._cars));

        this.inputHandler.addListener(D_KEYCODE, this.turnRightInput(this._cars));
        this.inputHandler.addListener(D_KEYCODE, this.turnRightInput(this._cars));
    }

    private accelerationInput(cars: [string, Car][]): Function {
        return (isKeyDown: boolean) => {
            cars[1][1].isAcceleratorPressed = isKeyDown;
        };
    }

    private turnLeftInput(cars: [string, Car][]): Function {
        return (isKeyDown: boolean) => {
            isKeyDown ? cars[1][1].steerLeft() : cars[1][1].releaseSteering();
        };
    }

    private brakeInput(cars: [string, Car][]): Function {
        return (isKeyDown: boolean) => {
            isKeyDown ? cars[1][1].brake() :  cars[1][1].releaseBrakes();
        };
    }

    private turnRightInput(cars: [string, Car][]): Function {
        return (isKeyDown: boolean) => {
            isKeyDown ? cars[1][1].steerRight() : cars[1][1].releaseSteering();
        };
    }

    private findVirtualPlayer(virtualPlayerName: string): Car {
        return  this._cars.filter( (car: [string, Car]) =>
                car[0] === virtualPlayerName
                )[0][1];
    }

    private textureColor(x: number): CAR_TEXTURE {
        return ++x % NUMBER_OF_TEXURES;
    }

    private fillCarArray( playerSkill: VirtualPlayerDifficulty ): void {
        PLAYERS_NAME.forEach( (name: string) => {
            const newCar: Car = name !== USERNAME ?
                        new VirtualPlayerCar(playerSkill, name, this.speedZoneService, this.raceProgressionService) :
                        new Car();

            this._cars.push([name, newCar]);
        });
    }

    private async initializeCars(): Promise<void> {
        for ( let i: number = 0; i < this._cars.length; i++) {
            await this.textureLoader.loadCarTexture(this.textureColor(i)).then(
                (texture: THREE.Object3D) => {
                    this._cars[i][1].init(texture);
                });
        }
    }
}
