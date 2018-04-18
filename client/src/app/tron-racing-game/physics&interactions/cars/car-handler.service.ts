import { Injectable } from "@angular/core";
import { Car } from "./car/car";
import { PLAYERS_NAME, USERNAME, GameState, CAR_TEXTURE } from "../../constants";
import * as THREE from "three";
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

    private _cars: {[name: string]: Car};
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

    public get cars(): {[name: string]: Car} {
        return this._cars;
    }

    public update(deltaTime: number): void {
        for (const key in this._cars) {
            if (this._cars.hasOwnProperty(key)) {
                this._cars[key].update(deltaTime);
            }
        }
    }

    public get carsOnly(): Car[] {
        const cars: Car[] = [];
        for (const key in this._cars) {
            if (this._cars.hasOwnProperty(key)) {
                cars.push(this._cars[key]);
            }
        }

        return cars;
    }

    public get playersPosition(): [string, THREE.Vector3][] {
        const playersPosition: [string, THREE.Vector3][] = [];
        for (const key in this._cars) {
            if (this._cars.hasOwnProperty(key)) {
                playersPosition.push([key, this._cars[key].mesh.position]);
            }
        }

        return playersPosition;
    }

    public getCar(name: string): Car {
        return this._cars[name];
    }

    public moveCarsToStart(waypoints: [number, number, number ][]): void {
        const carsPosition: CarStartPosition = new CarStartPosition( this.carsOnly, waypoints);
        carsPosition.moveCarsToStart();
    }

    public startRace(): void {
        for (const key in this._cars) {
            if (this._cars.hasOwnProperty(key)) {
                this._cars[key].changeState(GameState.RACE);
            }
        }
    }

    public endRace(): void {
        for (const key in this._cars) {
            if (this._cars.hasOwnProperty(key)) {
                this._cars[key].changeState(GameState.END);
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

    private turnRightInput(cars: {[name: string]: Car}): Function {
        return (isKeyDown: boolean) => {
            isKeyDown ? this.cars[USERNAME].steerRight() : this.cars[USERNAME].releaseSteering();
        };
    }

    private fillCarArray( playerSkill: VirtualPlayerDifficulty ): void {
        PLAYERS_NAME.forEach( (name: string) => {
            const newCar: Car = name !== USERNAME ?
                        new VirtualPlayerCar(playerSkill, name, this.speedZoneService, this.raceProgressionService) :
                        new Car();

            this._cars[name] = newCar;
        });
    }

    private async initializeCars(): Promise<void> {
        let carTexture: CAR_TEXTURE = CAR_TEXTURE.LIGHT_BLUE;
        for (const key in this._cars) {
            if (this._cars.hasOwnProperty(key)) {
                await this.textureLoader.loadCarTexture(carTexture++).then(
                    (texture: THREE.Object3D) => {
                        this._cars[key].init(texture);
                    });
            }
        }
    }
}
