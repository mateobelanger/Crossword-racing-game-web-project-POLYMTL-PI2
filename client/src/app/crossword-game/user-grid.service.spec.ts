import { TestBed, inject } from '@angular/core/testing';

import { UserGridService } from './user-grid.service';

describe('UserGridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserGridService]
    });
  });

  it('should be created', inject([UserGridService], (service: UserGridService) => {
    expect(service).toBeTruthy();
  }));
});
