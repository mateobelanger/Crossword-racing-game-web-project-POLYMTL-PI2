import { Car } from "../car/car";

export abstract class Command {
    public abstract execute(car: Car, isKeyDown: boolean): void;
}
