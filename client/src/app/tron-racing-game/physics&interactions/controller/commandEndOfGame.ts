import { CommandFormat } from "./commandFormat";
import { Car } from "../cars/car/car";
import { RaceDataHandlerService } from "../../raceData/race-data-handler.service";

export class CommandEndOfGame extends CommandFormat  {
    public execute(isKeyDown: boolean, car: Car, service: RaceDataHandlerService): void {
        if (!isKeyDown) {
            service.doneRace();
        }
    }
}
