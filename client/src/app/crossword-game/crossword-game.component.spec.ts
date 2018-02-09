import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import { CrosswordGameComponent } from './crossword-game.component';
import { CrosswordGameModule } from './crossword-game.module';
import { routes } from '../app-routes.module';
import { AppModule } from '../app.module';


describe('CrosswordGameComponent', () => {
  let component: CrosswordGameComponent;
  let fixture: ComponentFixture<CrosswordGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [routes, AppModule],
      providers: [{provide: APP_BASE_HREF, useValue : '/' }]
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
