import { Injectable } from '@angular/core';
import { Command } from './Command';
import { Car } from '../car/car';
import { CommandTurnLeft } from './CommandTurnLeft';
import { CommandAccelerate } from './commandAccelerate';
import { CommandBrake } from './commandBrake';
import { CommandTurnRight } from './commandTurnRight';
import { CommandCamera } from './commandCamera';
import { CommandNightDay } from './commandNightDay';

const W_KEYCODE: number = 87;
const A_KEYCODE: number = 65;
const S_KEYCODE: number = 83;
const D_KEYCODE: number = 68;
const C_KEYCODE: number = 67;
const N_KEYCODE: number = 78;

@Injectable()
export class InputHandlerService {
    private keyA: Command;
    private keyW: Command;
    private keyS: Command;
    private keyD: Command;
    private keyC: Command;
    private keyN: Command;

    public constructor() {
        this.keyA = new CommandTurnLeft();
        this.keyW = new CommandAccelerate();
        this.keyS = new CommandBrake();
        this.keyD = new CommandTurnRight();
        this.keyC = new CommandCamera();
        this.keyN = new CommandNightDay();
    }

    public handleInput(event: KeyboardEvent, isKeyDown: boolean, car: Car): void {
        switch (event.keyCode) {
            case A_KEYCODE:
                this.keyA.execute(car, isKeyDown);
                break;
            case W_KEYCODE:
                this.keyW.execute(car, isKeyDown);
                break;
            case S_KEYCODE:
                this.keyS.execute(car, isKeyDown);
                break;
            case D_KEYCODE:
                this.keyD.execute(car, isKeyDown);
                break;
            case C_KEYCODE:
                this.keyC.execute(car, isKeyDown);
                break;
            case N_KEYCODE:
                this.keyN.execute(car, isKeyDown);
                break;
            default:
                break;
        }
    }

}
