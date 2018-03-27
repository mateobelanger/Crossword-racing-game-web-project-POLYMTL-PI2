import { Injectable } from '@angular/core';
import { CommandFormat } from './commandFormat';
import { CommandTurnLeft } from './CommandTurnLeft';
import { CommandAccelerate } from './commandAccelerate';
import { CommandBrake } from './commandBrake';
import { CommandTurnRight } from './commandTurnRight';
import { CommandCamera } from './commandCamera';
import { CommandNightDay } from './commandNightDay';
import { RenderService } from '../render-service/render.service';
import { CameraService } from '../camera.service';
import { SceneLoaderService } from '../scene-loader/scene-loader.service';
import { RaceDataHandlerService } from '../race-data-handler.service';
import { CommandEndOfGame } from './commandEndOfGame';

const W_KEYCODE: number = 87;
const A_KEYCODE: number = 65;
const S_KEYCODE: number = 83;
const D_KEYCODE: number = 68;
const C_KEYCODE: number = 67;
const N_KEYCODE: number = 78;
const E_KEYCODE: number = 69;

@Injectable()
export class InputHandlerService {
    private keyA: CommandFormat;
    private keyW: CommandFormat;
    private keyS: CommandFormat;
    private keyD: CommandFormat;
    private keyC: CommandFormat;
    private keyN: CommandFormat;
    private keyE: CommandFormat;

    public constructor(private renderService: RenderService, private cameraService: CameraService ,
                       private sceneLoaderService: SceneLoaderService, private raceDataHandlerService: RaceDataHandlerService) {
        this.keyA = new CommandTurnLeft();
        this.keyW = new CommandAccelerate();
        this.keyS = new CommandBrake();
        this.keyD = new CommandTurnRight();
        this.keyC = new CommandCamera();
        this.keyN = new CommandNightDay();
        this.keyE = new CommandEndOfGame();
    }

    public handleInput(event: KeyboardEvent, isKeyDown: boolean): void {
        switch (event.keyCode) {
            case A_KEYCODE:
                this.keyA.execute(isKeyDown, this.renderService.car);
                break;
            case W_KEYCODE:
                this.keyW.execute(isKeyDown, this.renderService.car);
                break;
            case S_KEYCODE:
                this.keyS.execute(isKeyDown, this.renderService.car);
                break;
            case D_KEYCODE:
                this.keyD.execute(isKeyDown, this.renderService.car);
                break;
            case C_KEYCODE:
                this.keyC.execute(isKeyDown, this.renderService.car, this.cameraService);
                break;
            case N_KEYCODE:
                this.keyN.execute(isKeyDown, this.renderService.car, this.sceneLoaderService);
                break;
            case E_KEYCODE:
                this.keyE.execute(isKeyDown, this.renderService.car, this.raceDataHandlerService);
                break;
            default:
                break;
        }
    }

}
