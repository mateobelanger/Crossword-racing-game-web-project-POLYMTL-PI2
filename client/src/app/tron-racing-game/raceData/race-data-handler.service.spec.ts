import { TestBed, inject } from '@angular/core/testing';

import { RaceDataHandlerService } from './race-data-handler.service';
import { routes } from '../../app-routes.module';
import { AppModule } from '../../app.module';
import { APP_BASE_HREF } from '@angular/common';
import { InputHandlerService } from '../physics&interactions/controller/input-handler.service';
import { SpeedZonesService } from '../virtualPlayers/speed-zones.service';
import { TracksProxyService } from '../tracks/tracks-proxy.service';
// tslint:disable:no-magic-numbers
describe('RaceDataHandlerService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{provide: APP_BASE_HREF, useValue : '/' }, InputHandlerService, SpeedZonesService, TracksProxyService]
        });
    });

    it('should be created', inject([RaceDataHandlerService], (service: RaceDataHandlerService) => {
            expect(service).toBeTruthy();
        }));

});

