import { Car } from "../cars/car/car";
import { CameraService } from "../../gameRendering/camera.service";
import { SceneLoaderService } from "../../gameRendering/scene-loader/scene-loader.service";
import { RaceDataHandlerService } from "../../raceData/race-data-handler.service";

export abstract class CommandFormat {
    public abstract execute(isKeyDown: boolean, car?: Car, service?: CameraService | SceneLoaderService | RaceDataHandlerService): void;
}
