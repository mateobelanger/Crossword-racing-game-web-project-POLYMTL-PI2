import { TestBed, inject } from '@angular/core/testing';

import { InputHandlerService } from './input-handler.service';

describe('InputHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputHandlerService]
    });
  });

  it('should be created', inject([InputHandlerService], (service: InputHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
