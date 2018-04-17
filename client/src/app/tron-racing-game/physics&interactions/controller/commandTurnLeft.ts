import { CommandFormat } from "./commandFormat";
import { Car } from "../cars/car/car";

export class CommandTurnLeft extends CommandFormat {
    public execute(isKeyDown: boolean, cars: Car[]): void {
        isKeyDown ? cars[0].steerLeft() : cars[0].releaseSteering();
    }
}
