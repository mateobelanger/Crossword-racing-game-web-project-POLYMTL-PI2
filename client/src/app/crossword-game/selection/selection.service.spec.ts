import { TestBed, inject } from '@angular/core/testing';

import { SelectionService } from './selection.service';
import { routes } from '../../app-routes.module';
import { AppModule } from '../../app.module';
import { APP_BASE_HREF } from '@angular/common';

describe('SelectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [routes, AppModule],
      providers: [{provide: APP_BASE_HREF, useValue : '/' }]
    });
  });

  it('should be created', inject([SelectionService], (service: SelectionService) => {
    expect(service).toBeTruthy();
  }));
});
