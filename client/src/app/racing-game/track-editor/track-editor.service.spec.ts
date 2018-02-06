import { TestBed, inject } from '@angular/core/testing';

import { TrackEditorService } from './track-editor.service';
import { TrackEditorRenderService } from './track-editor-render.service';
import { Waypoint } from '../track/trackData/waypoint';
import { Vector3 } from 'three';

describe('TrackEditorService', () => {
  let editorService: TrackEditorService;
  let mockContainer: HTMLDivElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackEditorService, TrackEditorRenderService]
    });

    editorService.initialize(mockContainer);
    let waypoints: Waypoint[];

    waypoints.push(new Waypoint(new Vector3(0, 0, 0)));
    waypoints.push(new Waypoint(new Vector3(1, 1, 0)));
    waypoints.push(new Waypoint(new Vector3(2, 2, 0)));
    waypoints.push(new Waypoint(new Vector3(3, 10, 0)));


    editorService.addWaypoints(waypoints);
    editorService.
  });


  it('should be created', inject([TrackEditorService], (service: TrackEditorService) => {
    expect(service).toBeTruthy();
  }));

  it('')
});
