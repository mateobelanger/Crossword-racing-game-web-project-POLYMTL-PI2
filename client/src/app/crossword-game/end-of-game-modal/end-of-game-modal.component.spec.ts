import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { APP_BASE_HREF } from '@angular/common';

import { EndOfGameModalComponent } from './end-of-game-modal.component';
import { routes } from '../../app-routes.module';
import { AppModule } from '../../app.module';

describe('EndOfGameModalComponent', () => {
  let component: EndOfGameModalComponent;
  let fixture: ComponentFixture<EndOfGameModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [routes, AppModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
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
