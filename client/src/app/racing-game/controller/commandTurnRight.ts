import { CommandFormat } from "./commandFormat";
import { Car } from "../car/car";

export class CommandTurnRight extends CommandFormat  {
    public execute(isKeyDown: boolean, car: Car): void {
        isKeyDown ? car.steerRight() : car.releaseSteering();
    }
}
