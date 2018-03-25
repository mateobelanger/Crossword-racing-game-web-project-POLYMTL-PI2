import { Command } from "./command";
import { Car } from "../car/car";
import { SceneLoaderService } from "../scene-loader/scene-loader.service";

export class CommandNightDay extends Command  {
    private sceneLoaderService: SceneLoaderService;

    public execute(car: Car, isKeyDown: boolean): void {
        if (!isKeyDown) {
            this.sceneLoaderService.updateScene();
            car.switchLights();
        }
    }
}
