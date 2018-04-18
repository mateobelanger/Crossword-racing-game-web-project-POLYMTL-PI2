import { TestBed, inject } from "@angular/core/testing";

import { SceneLoaderService } from "./scene-loader.service";
import { SkyboxService } from "../skybox.service";
import { SceneLightsService } from "../scene-lights/scene-lights.service";
import { LandService } from "../land.service";

describe("SceneLoaderService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SceneLoaderService, SkyboxService, SceneLightsService, LandService]
        });
    });

    it("should be created", inject([SceneLoaderService], (service: SceneLoaderService) => {
        expect(service).toBeTruthy();
    }));
});
