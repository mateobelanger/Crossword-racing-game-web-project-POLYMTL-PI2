import { TestBed, inject } from '@angular/core/testing';

import { DefinitionsService } from './definitions.service';
import { WordService } from './word.service';
import { GridService } from './grid.service';

describe('DefinitionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DefinitionsService, WordService, GridService]
    });
  });

  it('should be created', inject([DefinitionsService], (service: DefinitionsService) => {
    expect(service).toBeTruthy();
  }));
});
