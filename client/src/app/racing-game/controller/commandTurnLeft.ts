import { Command } from "./command";
import { Car } from "../car/car";

export class CommandTurnLeft extends Command  {
    public execute(isKeyDown: boolean, car: Car): void {
        isKeyDown ? car.steerLeft() : car.releaseSteering();
    }
}
