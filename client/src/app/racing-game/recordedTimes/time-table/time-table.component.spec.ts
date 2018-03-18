import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestTimesComponent } from './time-table.component';
import { BestTimeHandlerService } from '../best-time-handler.service';
import { RaceDataHandlerService } from '../../race-data-handler.service';
import { TracksProxyService } from '../../tracks-proxy.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RaceResultsService } from '../race-results.service';

describe('TimeTableComponent', () => {
  let component: BestTimesComponent;
  let fixture: ComponentFixture<BestTimesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestTimesComponent ],
      imports: [HttpClientTestingModule],
      providers: [BestTimeHandlerService, RaceDataHandlerService, TracksProxyService, RaceResultsService]
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
