import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestTimesComponent } from './time-table.component';
import { BestTimeHandlerService } from '../best-time-handler.service';
import { RaceDataHandlerService } from '../../race-data-handler.service';
import { TracksProxyService } from '../../../tracks/tracks-proxy.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RaceResultsService } from '../race-results.service';

import { routes } from '../../../../app-routes.module';
import { AppModule } from '../../../../app.module';
import { APP_BASE_HREF } from '@angular/common';

describe('TimeTableComponent', () => {
 let component: BestTimesComponent;
 let fixture: ComponentFixture<BestTimesComponent>;

 beforeEach(async(() => {
   // tslint:disable-next-line:no-floating-promises
   TestBed.configureTestingModule({
     imports: [HttpClientTestingModule, routes, AppModule],
     providers: [BestTimeHandlerService, RaceDataHandlerService, TracksProxyService,
                 RaceResultsService, { provide: APP_BASE_HREF, useValue: '/' }]

   })
   .compileComponents();
 }));

 beforeEach(() => {
    fixture = TestBed.createComponent(BestTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 it('should create', () => {
    expect(component).toBeTruthy();
  });
});
