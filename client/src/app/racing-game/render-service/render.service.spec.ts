import { TestBed, inject } from "@angular/core/testing";

import { RenderService } from "./render.service";
import { CameraService } from '../camera.service';
import { SkyboxService } from '../skybox.service';
import { EndGameService } from "../end-game/end-game.service";
import { BestTimeHandlerService } from "../recordedTimes/best-time-handler.service";
import { RaceResultsService } from "../recordedTimes/race-results.service";
import { AudioService } from "../audio/audio.service";
import { TrackLoaderService } from "../track-loader.service";
import { SceneLightsService } from "../scene-lights/scene-lights.service";
import { SceneLoaderService } from "../scene-loader/scene-loader.service";

describe("RenderService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderService, CameraService, SkyboxService, EndGameService, BestTimeHandlerService, RaceResultsService]
            providers: [RenderService, CameraService, SkyboxService, SceneLightsService,
                        SceneLoaderService, AudioService, TrackLoaderService]
        });
    });

    it("should be created", inject([RenderService], (service: RenderService) => {
        expect(service).toBeTruthy();
    }));
});
