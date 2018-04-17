import { CommandFormat } from "./commandFormat";
import { CameraService } from "../../gameRendering/camera.service";
import { Car } from "../cars/car/car";

export class CommandCamera extends CommandFormat  {

    public execute(isKeyDown: boolean, cars: Car[],  service: CameraService): void {
        if (!isKeyDown) {
            service.changeCamera();
        }
    }
}
