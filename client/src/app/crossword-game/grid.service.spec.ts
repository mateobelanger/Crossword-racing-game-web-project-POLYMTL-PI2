import { TestBed, inject } from '@angular/core/testing';

import { GridService } from './grid.service';
import { WordService } from './word.service';

describe('GridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridService, WordService]
    });
  });

  it('should be created', inject([GridService], (service: GridService) => {
    expect(service).toBeTruthy();
  }));
});
