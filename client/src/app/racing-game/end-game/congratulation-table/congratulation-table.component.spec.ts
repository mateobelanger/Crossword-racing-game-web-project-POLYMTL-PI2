import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongratulationTableComponent } from './congratulation-table.component';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from '../../../app.module';
import { routes } from '../../../app-routes.module';

describe('CongratulationTableComponent', () => {
  let component: CongratulationTableComponent;
  let fixture: ComponentFixture<CongratulationTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [routes, AppModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongratulationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
