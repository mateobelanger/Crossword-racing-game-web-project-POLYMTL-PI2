import { Car } from "../car/car";
import { CommandFormat } from "./commandFormat";

export class CommandTurnLeft extends CommandFormat {
    public execute(isKeyDown: boolean, car: Car): void {
        isKeyDown ? car.steerLeft() : car.releaseSteering();
    }
}
