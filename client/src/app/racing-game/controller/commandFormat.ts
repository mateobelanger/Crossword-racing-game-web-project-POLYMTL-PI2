import { Car } from "../cars/car/car";
import { CameraService } from "../camera.service";
import { SceneLoaderService } from "../scene-loader/scene-loader.service";

export abstract class CommandFormat {
    public abstract execute(isKeyDown: boolean, car?: Car, service?: CameraService | SceneLoaderService): void;
}
