import { Command } from "./command";
import { Car } from "../car/car";

export class CommandBrake extends Command  {
    public execute(car: Car, isKeyDown: boolean): void {
        isKeyDown ? car.brake() : car.releaseBrakes();
    }
}
