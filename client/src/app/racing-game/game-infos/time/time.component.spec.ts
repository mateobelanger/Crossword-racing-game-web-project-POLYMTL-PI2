import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeComponent } from './time.component';
import { RaceDataHandlerService } from '../../race-data-handler.service';
import { TracksProxyService } from '../../tracks-proxy.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BestTimeHandlerService } from '../../recordedTimes/best-time-handler.service';

describe('TimeComponent', () => {
  let component: TimeComponent;
  let fixture: ComponentFixture<TimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeComponent ],
      imports: [HttpClientTestingModule],
      providers: [ RaceDataHandlerService, TracksProxyService, BestTimeHandlerService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
