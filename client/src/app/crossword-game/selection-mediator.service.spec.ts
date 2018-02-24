import { TestBed, inject } from '@angular/core/testing';

import { SelectionMediatorService } from './selection-mediator.service';
import { GridService } from './grid.service';
import { WordService } from './word.service';
import { DefinitionsService } from './definitions.service';

describe('SelectionMediatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SelectionMediatorService,
        GridService,
        WordService,
        DefinitionsService
      ]
    });
  });

  it('should be created', inject([SelectionMediatorService], (service: SelectionMediatorService) => {
    expect(service).toBeTruthy();
  }));
});
