import { CommandFormat } from "./commandFormat";
import { CameraService } from "../camera.service";
import { Car } from "../cars/car/car";

export class CommandCameraZoomIn extends CommandFormat  {

    public execute(isKeyDown: boolean, car: Car,  service: CameraService): void {
        if (!isKeyDown) {
            service.zoomIn();
        }
    }
}
