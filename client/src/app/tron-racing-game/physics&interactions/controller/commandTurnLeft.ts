import { CommandFormat } from "./commandFormat";
import { Car } from "../cars/car/car";

export class CommandTurnLeft extends CommandFormat {
    public execute(isKeyDown: boolean, car: Car): void {
        isKeyDown ? car.steerLeft() : car.releaseSteering();
    }
}
