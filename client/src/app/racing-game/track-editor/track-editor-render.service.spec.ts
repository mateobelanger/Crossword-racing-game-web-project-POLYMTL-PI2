
import { TestBed, inject } from '@angular/core/testing';


import { TrackEditorRenderService } from './track-editor-render.service';

describe('TrackEditorRenderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackEditorRenderService]

    });
  });

  it('should be created', inject([TrackEditorRenderService], (service: TrackEditorRenderService) => {
    expect(service).toBeTruthy();
  }));
});
