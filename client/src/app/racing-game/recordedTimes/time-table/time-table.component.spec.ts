import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestTimesComponent } from './time-table.component';
import { BestTimeHandlerService } from '../best-time-handler.service';
import { RaceDataHandlerService } from '../../race-data-handler.service';

describe('BestTimesComponent', () => {
  let component: BestTimesComponent;
  let fixture: ComponentFixture<BestTimesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestTimesComponent ],
      providers: [BestTimeHandlerService, RaceDataHandlerService]
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
