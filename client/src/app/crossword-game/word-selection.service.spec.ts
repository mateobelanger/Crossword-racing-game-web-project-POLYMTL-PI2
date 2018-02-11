import { TestBed, inject } from '@angular/core/testing';

import { WordSelectionService } from './word-selection.service';

describe('WordSelectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordSelectionService]
    });
  });

  it('should be created', inject([WordSelectionService], (service: WordSelectionService) => {
    expect(service).toBeTruthy();
  }));
});
