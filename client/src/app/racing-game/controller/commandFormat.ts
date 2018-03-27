import { Car } from "../cars/car/car";
import { CameraService } from "../camera.service";
import { SceneLoaderService } from "../scene-loader/scene-loader.service";
import { RaceDataHandlerService } from "../race-data-handler.service";

export abstract class CommandFormat {
    public abstract execute(isKeyDown: boolean, car?: Car, service?: CameraService | SceneLoaderService | RaceDataHandlerService): void;
}
