import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodiumTableComponent } from './podium-table.component';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from '../../../app.module';
import { routes } from '../../../app-routes.module';

describe('PodiumTableComponent', () => {
  let component: PodiumTableComponent;
  let fixture: ComponentFixture<PodiumTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [routes, AppModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodiumTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
