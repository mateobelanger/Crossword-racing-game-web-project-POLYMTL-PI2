import { Command } from "./command";
import { Car } from "../car/car";

export class CommandTurnRight extends Command  {
    public execute(isKeyDown: boolean, car: Car): void {
        isKeyDown ? car.steerRight() : car.releaseSteering();
    }
}
