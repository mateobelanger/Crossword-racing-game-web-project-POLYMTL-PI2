import { CommandFormat } from "./commandFormat";
import { CameraService } from "../camera.service";
import { Car } from "../car/car";

export class CommandCamera extends CommandFormat  {

    public execute(isKeyDown: boolean, car: Car,  service: CameraService): void {
        if (!isKeyDown) {
            service.changeCamera();
        }
    }
}
