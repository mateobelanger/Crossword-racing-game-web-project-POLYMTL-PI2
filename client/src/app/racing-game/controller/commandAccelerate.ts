import { Command } from "./command";
import { Car } from "../car/car";

export class CommandAccelerate extends Command  {
    public execute(car: Car, isKeyDown: boolean): void {
        car.isAcceleratorPressed = isKeyDown;
    }
}
