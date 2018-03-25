import { Command } from "./command";
import { CameraService } from "../camera.service";
import { Car } from "../car/car";

export class CommandCamera extends Command  {

    public execute(isKeyDown: boolean, car: Car,  service: CameraService): void {
        if (!isKeyDown) {
            service.changeCamera();
        }
    }
}
