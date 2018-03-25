import { Command } from "./command";
import { Car } from "../car/car";

export class CommandBrake extends Command  {
    public execute(isKeyDown: boolean, car: Car): void {
        isKeyDown ? car.brake() : car.releaseBrakes();
    }
}
