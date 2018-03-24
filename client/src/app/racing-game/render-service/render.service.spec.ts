import { TestBed, inject } from "@angular/core/testing";

import { RenderService } from "./render.service";
import { CameraService } from '../camera.service';
import { SkyboxService } from '../skybox.service';
<<<<<<< HEAD
import { TrackLoaderService } from "../track-loader.service";
=======
import { AudioService } from "../audio/audio.service";
>>>>>>> master

describe("RenderService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
<<<<<<< HEAD
            providers: [RenderService, CameraService, SkyboxService, TrackLoaderService]
=======
            providers: [RenderService, CameraService, SkyboxService, AudioService]
>>>>>>> master
        });
    });

    it("should be created", inject([RenderService], (service: RenderService) => {
        expect(service).toBeTruthy();
    }));
});
