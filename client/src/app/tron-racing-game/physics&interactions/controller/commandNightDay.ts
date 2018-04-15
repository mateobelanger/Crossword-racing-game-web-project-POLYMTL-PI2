import { CommandFormat } from "./commandFormat";
import { SceneLoaderService } from "../../gameRendering/scene-loader/scene-loader.service";
import { Car } from "../cars/car/car";

export class CommandNightDay extends CommandFormat  {

    public execute(isKeyDown: boolean, cars: Car[], service: SceneLoaderService): void {
        if (!isKeyDown) {
            service.updateScene();
            cars.forEach((car: Car) => {
                car.switchLights();
            });
        }
    }
}
