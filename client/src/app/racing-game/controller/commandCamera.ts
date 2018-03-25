import { Command } from "./command";
import { Car } from "../car/car";
import { CameraService } from "../camera.service";

export class CommandCamera extends Command  {
    private cameraService: CameraService;

    public execute(car: Car, isKeyDown: boolean): void {
        if (!isKeyDown) {
            this.cameraService.changeCamera();
        }
    }
}
