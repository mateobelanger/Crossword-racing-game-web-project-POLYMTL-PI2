import { TestBed, inject } from '@angular/core/testing';

import { SpeedZonesService } from './speed-zones.service';

describe('SpeedZonesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeedZonesService]
    });
  });

  it('should be created', inject([SpeedZonesService], (service: SpeedZonesService) => {
    expect(service).toBeTruthy();
  }));
});
