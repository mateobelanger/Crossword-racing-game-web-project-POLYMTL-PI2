import { TestBed, inject } from '@angular/core/testing';

import { LoadingTrackHandlerService } from './loading-track-handler.service';

describe('LoadingTrackHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingTrackHandlerService]
    });
  });

  it('should be created', inject([LoadingTrackHandlerService], (service: LoadingTrackHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
