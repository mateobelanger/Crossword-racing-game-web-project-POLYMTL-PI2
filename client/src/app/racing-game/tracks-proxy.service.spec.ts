import { TestBed, inject } from '@angular/core/testing';

import { TracksProxyService } from './tracks-proxy.service';

describe('TracksProxyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TracksProxyService]
    });
  });

  it('should be created', inject([TracksProxyService], (service: TracksProxyService) => {
    expect(service).toBeTruthy();
  }));
});
