import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameInfosComponent } from './game-infos.component';

describe('GameInfosComponent', () => {
  let component: GameInfosComponent;
  let fixture: ComponentFixture<GameInfosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameInfosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
