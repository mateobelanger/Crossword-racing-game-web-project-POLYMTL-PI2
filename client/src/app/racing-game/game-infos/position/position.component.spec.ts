import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionComponent } from './position.component';
import { RaceDataHandlerService } from '../../race-data-handler.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TracksProxyService } from '../../tracks-proxy.service';
import { BestTimeHandlerService } from '../../recordedTimes/best-time-handler.service';
import { RaceResultsService } from '../../recordedTimes/race-results.service';
import { RaceProgressionHandlerService } from '../../raceProgression/race-progression-handler.service';
import { CarHandlerService } from '../../cars/car-handler.service';
import { TrackLoaderService } from '../../track-loader.service';

describe('PositionComponent', () => {
    let component: PositionComponent;
    let fixture: ComponentFixture<PositionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PositionComponent],
            imports: [HttpClientTestingModule],
            providers: [RaceDataHandlerService, TracksProxyService, BestTimeHandlerService, RaceResultsService,
                        RaceProgressionHandlerService, CarHandlerService, TrackLoaderService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PositionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
