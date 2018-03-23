import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedComponent } from './speed.component';
import { RenderService } from '../../render-service/render.service';
import { CameraService } from '../../camera.service';
import { SkyboxService } from '../../skybox.service';
import { TrackLoaderService } from '../../track-loader.service';

describe('SpeedComponent', () => {
  let component: SpeedComponent;
  let fixture: ComponentFixture<SpeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedComponent ],
      providers: [RenderService, CameraService, SkyboxService, TrackLoaderService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
