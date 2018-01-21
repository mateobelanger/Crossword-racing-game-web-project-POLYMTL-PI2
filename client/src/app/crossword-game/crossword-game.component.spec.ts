import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrosswordGameComponent } from './crossword-game.component';

describe('CrosswordGameComponent', () => {
  let component: CrosswordGameComponent;
  let fixture: ComponentFixture<CrosswordGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosswordGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrosswordGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
