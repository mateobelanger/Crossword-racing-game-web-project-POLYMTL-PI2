import { CommandFormat } from "./commandFormat";
import { Car } from "../cars/car/car";

export class CommandBrake extends CommandFormat  {
    public execute(isKeyDown: boolean, car: Car): void {
        isKeyDown ? car.brake() : car.releaseBrakes();
    }
}
