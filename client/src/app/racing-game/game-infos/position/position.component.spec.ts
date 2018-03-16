import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionComponent } from './position.component';
import { RaceDataHandlerService } from '../../race-data-handler.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TracksProxyService } from '../../tracks-proxy.service';
import { BestTimeHandlerService } from '../../bestTimes/best-time-handler.service';

describe('PositionComponent', () => {
  let component: PositionComponent;
  let fixture: ComponentFixture<PositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionComponent ],
      imports: [HttpClientTestingModule],
      providers: [ RaceDataHandlerService, TracksProxyService, BestTimeHandlerService ]
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
