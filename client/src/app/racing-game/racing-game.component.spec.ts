import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RacingGameComponent } from './racing-game.component';
import { GameComponent } from './game-component/game.component';
import { RenderService } from './render-service/render.service';
import { RacingGameModule } from './racing-game.module';

describe('RacingGameComponent', () => {
  let component: RacingGameComponent;
  let fixture: ComponentFixture<RacingGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [RacingGameModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RacingGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
