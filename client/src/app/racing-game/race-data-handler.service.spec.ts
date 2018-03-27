import { TestBed, inject } from '@angular/core/testing';

import { RaceDataHandlerService } from './race-data-handler.service';
import { routes } from '../app-routes.module';
import { AppModule } from '../app.module';
import { APP_BASE_HREF } from '@angular/common';
// tslint:disable:no-magic-numbers
describe('RaceDataHandlerService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{provide: APP_BASE_HREF, useValue : '/' }]
        });
    });

    it('should be created', inject([RaceDataHandlerService], (service: RaceDataHandlerService) => {
            expect(service).toBeTruthy();
        }));

});

