import { Command } from "./command";
import { Car } from "../car/car";

export class CommandTurnLeft extends Command  {
    public execute(car: Car, isKeyDown: boolean): void {
        isKeyDown ? car.steerLeft() : car.releaseSteering();
    }
}
