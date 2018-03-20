import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeShowComponent } from './time-show.component';

describe('TimeShowComponent', () => {
  let component: TimeShowComponent;
  let fixture: ComponentFixture<TimeShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
