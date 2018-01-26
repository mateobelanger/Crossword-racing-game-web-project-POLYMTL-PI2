import { TestBed, inject } from '@angular/core/testing';

import { TrackEditorService } from './track-editor.service';

describe('TrackEditorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackEditorService]
    });
  });

  it('should be created', inject([TrackEditorService], (service: TrackEditorService) => {
    expect(service).toBeTruthy();
  }));
});
