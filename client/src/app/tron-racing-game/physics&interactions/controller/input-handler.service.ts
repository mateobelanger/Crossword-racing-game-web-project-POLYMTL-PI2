import { Injectable } from "@angular/core";
import { CommandFormat } from "./commandFormat";
import { CommandTurnLeft } from "./CommandTurnLeft";
import { CommandAccelerate } from "./commandAccelerate";
import { CommandBrake } from "./commandBrake";
import { CommandTurnRight } from "./commandTurnRight";
import { CommandCameraZoomOut } from "./commandCameraZoomOut";
import { CommandCameraZoomIn } from "./commandCameraZoomIn";
import { CommandCamera } from "./commandCamera";
import { CommandNightDay } from "./commandNightDay";
import { CameraService } from "../../gameRendering/camera.service";
import { SceneLoaderService } from "../../gameRendering/scene-loader/scene-loader.service";
import { CommandNull } from "./commandNull";
import { Car } from "../cars/car/car";
import { RenderService } from "../../gameRendering/render-service/render.service";
import { CarHandlerService } from "../cars/car-handler.service";

const W_KEYCODE: number = 87;
const A_KEYCODE: number = 65;
const S_KEYCODE: number = 83;
const D_KEYCODE: number = 68;
const C_KEYCODE: number = 67;
const N_KEYCODE: number = 78;
const I_KEYCODE: number = 187;
const O_KEYCODE: number = 189;

@Injectable()
export class InputHandlerService {
    private keyA: CommandFormat;
    private keyW: CommandFormat;
    private keyS: CommandFormat;
    private keyD: CommandFormat;
    private keyC: CommandFormat;
    private keyN: CommandFormat;
    private keyI: CommandFormat;
    private keyO: CommandFormat;

    public constructor(private renderService: RenderService, private cameraService: CameraService ,
                       private sceneLoaderService: SceneLoaderService, private carHandler: CarHandlerService) {
        this.keyA = new CommandNull();
        this.keyW = new CommandNull();
        this.keyS = new CommandNull();
        this.keyD = new CommandNull();
        this.keyC = new CommandCamera();
        this.keyI = new CommandCameraZoomIn();
        this.keyO = new CommandCameraZoomOut();
        this.keyN = new CommandNightDay();
    }

    public handleInput(event: KeyboardEvent, isKeyDown: boolean): void {
        const cars: Car[] = [];
        cars.push(this.renderService.car);
        switch (event.keyCode) {
            case A_KEYCODE:
                this.keyA.execute(isKeyDown, cars); break;
            case W_KEYCODE:
                this.keyW.execute(isKeyDown, cars); break;
            case S_KEYCODE:
                this.keyS.execute(isKeyDown, cars); break;
            case D_KEYCODE:
                this.keyD.execute(isKeyDown, cars); break;
            case C_KEYCODE:
                this.keyC.execute(isKeyDown, cars, this.cameraService); break;
            case N_KEYCODE:
                this.keyN.execute(isKeyDown, this.carHandler.carsOnly, this.sceneLoaderService); break;
            case I_KEYCODE:
                this.keyI.execute(isKeyDown, cars, this.cameraService); break;
            case O_KEYCODE:
                this.keyO.execute(isKeyDown, cars, this.cameraService); break;
            default: break;
        }
    }

    // WASD controls are enabled once the race signal is given
    public enableControlKeys(): void {
        this.keyA = new CommandTurnLeft();
        this.keyW = new CommandAccelerate();
        this.keyS = new CommandBrake();
        this.keyD = new CommandTurnRight();
    }
}
