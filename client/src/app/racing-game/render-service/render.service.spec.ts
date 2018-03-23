import { TestBed, inject } from "@angular/core/testing";

import { RenderService } from "./render.service";
import { CameraService } from '../camera.service';
import { SkyboxService } from '../skybox.service';
import { TrackLoaderService } from "../track-loader.service";

describe("RenderService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderService, CameraService, SkyboxService, TrackLoaderService]
        });
    });

    it("should be created", inject([RenderService], (service: RenderService) => {
        expect(service).toBeTruthy();
    }));
});
