import { TestBed, inject } from '@angular/core/testing';

import { TrackEditorService } from './track-editor.service';
import { TrackEditorRenderService } from './track-editor-render.service';

describe('TrackEditorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackEditorService, TrackEditorRenderService]
    });
  });

  it('should be created', inject([TrackEditorService], (service: TrackEditorService) => {
    expect(service).toBeTruthy();
  }));
});
