import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameUiComponent } from './game-ui.component';

describe('GameUiComponent', () => {
  let component: GameUiComponent;
  let fixture: ComponentFixture<GameUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
