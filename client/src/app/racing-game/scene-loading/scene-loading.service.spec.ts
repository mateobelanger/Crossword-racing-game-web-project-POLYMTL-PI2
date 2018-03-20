import { TestBed, inject } from '@angular/core/testing';

import { SceneLoadingService } from './scene-loading.service';

describe('SceneLoadingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SceneLoadingService]
    });
  });

  it('should be created', inject([SceneLoadingService], (service: SceneLoadingService) => {
    expect(service).toBeTruthy();
  }));
});
