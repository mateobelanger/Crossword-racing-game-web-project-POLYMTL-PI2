import { TestBed, inject } from "@angular/core/testing";

import { RenderService } from "./render.service";
import { CameraService } from '../camera.service';
import { SkyboxService } from '../skybox.service';
import { LoadingTrackHandlerService } from "../loading-track-handler.service";

describe("RenderService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderService, CameraService, SkyboxService, LoadingTrackHandlerService]
        });
    });

    it("should be created", inject([RenderService], (service: RenderService) => {
        expect(service).toBeTruthy();
    }));
});
