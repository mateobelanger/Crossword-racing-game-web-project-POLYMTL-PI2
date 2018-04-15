import { CommandFormat } from "./commandFormat";
import { Car } from "../cars/car/car";

export class CommandAccelerate extends CommandFormat  {
    public execute(isKeyDown: boolean, cars: Car[]): void {
        cars[0].isAcceleratorPressed = isKeyDown;
    }
}
