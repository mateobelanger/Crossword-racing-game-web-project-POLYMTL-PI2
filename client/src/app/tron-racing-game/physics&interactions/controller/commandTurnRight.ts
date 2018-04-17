import { CommandFormat } from "./commandFormat";
import { Car } from "../cars/car/car";

export class CommandTurnRight extends CommandFormat  {
    public execute(isKeyDown: boolean, cars: Car[]): void {
        isKeyDown ? cars[0].steerRight() : cars[0].releaseSteering();
    }
}
