import { CommandFormat } from "./commandFormat";
import { Car } from "../car/car";

export class CommandAccelerate extends CommandFormat  {
    public execute(isKeyDown: boolean, car: Car): void {
        car.isAcceleratorPressed = isKeyDown;
    }
}
