import { Command } from "./command";
import { Car } from "../car/car";

export class CommandAccelerate extends Command  {
    public execute(isKeyDown: boolean, car: Car): void {
        car.isAcceleratorPressed = isKeyDown;
    }
}
