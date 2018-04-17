import { TestBed, inject } from "@angular/core/testing";
import { CarHandlerService } from "./car-handler.service";
import { SpeedZonesService } from "../../virtualPlayers/speed-zones.service";
import { RaceProgressionHandlerService } from "../../raceData/raceProgression/race-progression-handler.service";
import { TextureLoaderService } from "../../gameRendering/textureLoader/texture-loader.service";
import { InputHandlerService } from "../controller/input-handler.service";

describe("CarHandlerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CarHandlerService, SpeedZonesService, RaceProgressionHandlerService, TextureLoaderService, InputHandlerService]
        });
    });

    it("should be created", inject([CarHandlerService], (service: CarHandlerService) => {
        expect(service).toBeTruthy();
    }));
});
