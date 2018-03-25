import { Command } from "./command";
import { Car } from "../car/car";

export class CommandTurnRight extends Command  {
    public execute(car: Car, isKeyDown: boolean): void {
        isKeyDown ? car.steerRight() : car.releaseSteering();
    }
}
