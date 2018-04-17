import { CommandFormat } from "./commandFormat";
import { Car } from "../cars/car/car";

export class CommandBrake extends CommandFormat  {
    public execute(isKeyDown: boolean, cars: Car[]): void {
        isKeyDown ? cars[0].brake() : cars[0].releaseBrakes();
    }
}
