import { TestBed, inject } from '@angular/core/testing';

import { SceneLoadingService } from './scene-loading.service';
import { SkyboxService } from '../skybox.service';
import { SceneLightsService } from '../scene-lights/scene-lights.service';

describe('SceneLoadingService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SceneLoadingService, SkyboxService, SceneLightsService]
        });
    });

    it('should be created', inject([SceneLoadingService], (service: SceneLoadingService) => {
        expect(service).toBeTruthy();
    }));
});
