import { CommandFormat } from "./commandFormat";
import { SceneLoaderService } from "../scene-loader/scene-loader.service";
import { Car } from "../car/car";

export class CommandNightDay extends CommandFormat  {

    public execute(isKeyDown: boolean, car: Car, service: SceneLoaderService): void {
        if (!isKeyDown) {
            service.updateScene();
            car.switchLights();
        }
    }
}
