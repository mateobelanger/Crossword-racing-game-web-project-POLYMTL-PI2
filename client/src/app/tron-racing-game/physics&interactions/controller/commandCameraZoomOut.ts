import { CommandFormat } from "./commandFormat";
import { CameraService } from "../../gameRendering/camera.service";
import { Car } from "../cars/car/car";

export class CommandCameraZoomOut extends CommandFormat  {

    public execute(isKeyDown: boolean, car: Car,  service: CameraService): void {
        service.isZoomingOut = isKeyDown;
    }
}
