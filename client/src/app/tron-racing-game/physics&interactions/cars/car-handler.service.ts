import { Injectable } from "@angular/core";
import * as THREE from "three";

import { Car } from "./car/car";
import { PLAYERS_NAME, USERNAME, GameState, CAR_TEXTURE } from "../../constants";
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

    private _cars: {[playerName: string]: Car};
    public constructor( private speedZoneService: SpeedZonesService,
                        private raceProgressionService: RaceProgressionHandlerService,
                        private textureLoader: TextureLoaderService,
                        private inputHandler: InputHandlerService) {
        this._cars = {};
    }

    public async initialize(playerSkill: VirtualPlayerDifficulty): Promise<void> {
        this.fillCarArray(playerSkill);
        await this.initializeCars();
    }

    public get cars(): {[playerName: string]: Car} {
        return this._cars;
    }

    public update(deltaTime: number): void {
        for (const playerName in this._cars) {
            if (this._cars.hasOwnProperty(playerName)) {
                this._cars[playerName].update(deltaTime);
            }
        }
    }

    public get carsOnly(): Car[] {
        const cars: Car[] = [];
        for (const playerName in this._cars) {
            if (this._cars.hasOwnProperty(playerName)) {
                cars.push(this._cars[playerName]);
            }
        }

        return cars;
    }

    public get playersPosition(): {[playerName: string]: THREE.Vector3} {
        const playersPosition: {[playerName: string]: THREE.Vector3} = {};
        for (const playerName in this._cars) {
            if (this._cars.hasOwnProperty(playerName)) {
                playersPosition[playerName] = this._cars[playerName].mesh.position;
            }
        }

        return playersPosition;
    }

    public getCar(playerName: string): Car {
        return this._cars[playerName];
    }

    public moveCarsToStart(waypoints: [number, number, number ][]): void {
        const carsPosition: CarStartPosition = new CarStartPosition( this.carsOnly, waypoints);
        carsPosition.moveCarsToStart();
    }

    public startRace(): void {
        for (const playerName in this._cars) {
            if (this._cars.hasOwnProperty(playerName)) {
                this._cars[playerName].changeState(GameState.RACE);
            }
        }
    }

    public endRace(): void {
        for (const playerName in this._cars) {
            if (this._cars.hasOwnProperty(playerName)) {
                this._cars[playerName].changeState(GameState.END);
            }
        }
    }

    public virtualPlayerFinished(virtualPlayerName: string): void {
        this.getCar(virtualPlayerName).changeState(GameState.END);
    }

    public enableControlKeys(): void {
        this.inputHandler.addListener(W_KEYCODE, this.accelerationInput());
        this.inputHandler.addListener(W_KEYCODE, this.accelerationInput());

        this.inputHandler.addListener(A_KEYCODE, this.turnLeftInput());
        this.inputHandler.addListener(A_KEYCODE, this.turnLeftInput());

        this.inputHandler.addListener(S_KEYCODE, this.brakeInput());
        this.inputHandler.addListener(S_KEYCODE, this.brakeInput());

        this.inputHandler.addListener(D_KEYCODE, this.turnRightInput(this._cars));
        this.inputHandler.addListener(D_KEYCODE, this.turnRightInput(this._cars));
    }

    private accelerationInput(): Function {
        return (isKeyDown: boolean) => {
            this.cars[USERNAME].isAcceleratorPressed = isKeyDown;
        };
    }

    private turnLeftInput(): Function {
        return (isKeyDown: boolean) => {
            isKeyDown ? this.cars[USERNAME].steerLeft() : this.cars[USERNAME].releaseSteering();
        };
    }

    private brakeInput(): Function {
        return (isKeyDown: boolean) => {
            isKeyDown ? this.cars[USERNAME].brake() :  this.cars[USERNAME].releaseBrakes();
        };
    }

    private turnRightInput(cars: {[playerName: string]: Car}): Function {
        return (isKeyDown: boolean) => {
            isKeyDown ? this.cars[USERNAME].steerRight() : this.cars[USERNAME].releaseSteering();
        };
    }

    private fillCarArray( playerSkill: VirtualPlayerDifficulty ): void {
        PLAYERS_NAME.forEach( (playerName: string) => {
            const newCar: Car = playerName !== USERNAME ?
                        new VirtualPlayerCar(playerSkill, playerName, this.speedZoneService, this.raceProgressionService) :
                        new Car();

            this._cars[playerName] = newCar;
        });
    }

    private async initializeCars(): Promise<void> {
        let carTexture: CAR_TEXTURE = CAR_TEXTURE.LIGHT_BLUE;
        for (const playerName in this._cars) {
            if (this._cars.hasOwnProperty(playerName)) {
                await this.textureLoader.loadCarTexture(carTexture++).then(
                    (texture: THREE.Object3D) => {
                        this._cars[playerName].init(texture);
                    });
            }
        }
    }
}
