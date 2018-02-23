import { TestBed, inject } from '@angular/core/testing';

import { DefinitionsService } from './definitions.service';

describe('DefinitionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DefinitionsService]
    });
  });

  it('should be created', inject([DefinitionsService], (service: DefinitionsService) => {
    expect(service).toBeTruthy();
  }));
});
