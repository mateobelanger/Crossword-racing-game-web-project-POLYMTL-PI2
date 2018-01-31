import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackEditorComponent } from './track-editor.component';
import { TrackEditorService } from './track-editor.service';
import { TrackEditorRenderService } from './track-editor-render.service';


describe('TrackEditorComponent', () => {
  let component: TrackEditorComponent;
  let fixture: ComponentFixture<TrackEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackEditorComponent ],
      providers: [TrackEditorService, TrackEditorRenderService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
