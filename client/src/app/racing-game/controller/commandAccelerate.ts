import { CommandFormat } from "./commandFormat";
import { Car } from "../cars/car/car";

export class CommandAccelerate extends CommandFormat  {
    public execute(isKeyDown: boolean, car: Car): void {
        car.isAcceleratorPressed = isKeyDown;
    }
}
