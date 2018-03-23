import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndOfGameModalComponent } from './end-of-game-modal.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('EndOfGameModalComponent', () => {
  let component: EndOfGameModalComponent;
  let fixture: ComponentFixture<EndOfGameModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndOfGameModalComponent ],
      imports: [ RouterTestingModule ]
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

  it("should restart", () => {
  const restartButon: string = fixture.debugElement.query(By.css("#restart")).nativeElement
    .getAttribute('href');
  expect(restartButon).toEqual('/crossword-game/Difficulty.EASY/ui');
  });

});
