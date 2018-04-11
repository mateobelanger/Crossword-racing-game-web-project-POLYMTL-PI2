import { TestBed, inject } from '@angular/core/testing';

import { PortalsHandlerService } from './portals-handler.service';

describe('PortalsHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PortalsHandlerService]
    });
  });

  it('should be created', inject([PortalsHandlerService], (service: PortalsHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
