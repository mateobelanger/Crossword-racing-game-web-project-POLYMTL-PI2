import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LapComponent } from './lap.component';
import { RaceDataHandlerService } from '../../race-data-handler.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TracksProxyService } from '../../tracks-proxy.service';
import { BestTimeHandlerService } from '../../recordedTimes/best-time-handler.service';

describe('LapComponent', () => {
  let component: LapComponent;
  let fixture: ComponentFixture<LapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LapComponent ],
      imports: [HttpClientTestingModule],
      providers: [ RaceDataHandlerService, TracksProxyService, BestTimeHandlerService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
