import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndOfGameModalComponent } from './end-of-game-modal.component';

describe('EndOfGameModalComponent', () => {
  let component: EndOfGameModalComponent;
  let fixture: ComponentFixture<EndOfGameModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndOfGameModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndOfGameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
