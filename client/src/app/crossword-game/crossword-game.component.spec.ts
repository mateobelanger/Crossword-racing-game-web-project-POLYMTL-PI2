import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrosswordGameComponent } from './crossword-game.component';
import { CrosswordGameModule } from './crossword-game.module';


describe('CrosswordGameComponent', () => {
  let component: CrosswordGameComponent;
  let fixture: ComponentFixture<CrosswordGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ CrosswordGameModule ]
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
