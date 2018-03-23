import { TestBed, inject } from "@angular/core/testing";

import { RenderService } from "./render.service";
import { CameraService } from '../camera.service';
import { SkyboxService } from '../skybox.service';
import { AudioService } from "../audio/audio.service";

describe("RenderService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderService, CameraService, SkyboxService, AudioService]
        });
    });

    it("should be created", inject([RenderService], (service: RenderService) => {
        expect(service).toBeTruthy();
    }));
});
