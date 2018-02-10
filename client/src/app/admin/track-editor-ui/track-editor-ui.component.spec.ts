import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import { TrackEditorUiComponent } from './track-editor-ui.component';
import { routes } from '../../app-routes.module';
import { AppModule } from '../../app.module';

describe('TrackEditorUiComponent', () => {
  let component: TrackEditorUiComponent;
  let fixture: ComponentFixture<TrackEditorUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [routes, AppModule],
      providers: [{provide: APP_BASE_HREF, useValue : '/' }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackEditorUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
