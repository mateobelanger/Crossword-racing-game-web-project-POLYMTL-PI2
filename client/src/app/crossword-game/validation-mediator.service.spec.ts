import { TestBed, inject } from '@angular/core/testing';

import { ValidationMediatorService } from './validation-mediator.service';
import { GridService } from './grid.service';
import { WordService } from './word.service';
import { DefinitionsService } from './definitions.service';

describe('ValidationMediatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ValidationMediatorService,
        GridService,
        WordService,
        DefinitionsService
      ]
    });
  });

  it('should be created', inject([ValidationMediatorService], (service: ValidationMediatorService) => {
    expect(service).toBeTruthy();
  }));
});
