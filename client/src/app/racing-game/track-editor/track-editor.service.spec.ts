import { TestBed, inject } from '@angular/core/testing';
import { TrackEditorService } from './track-editor.service';
import { TrackEditorRenderService } from './track-editor-render.service';
import { Waypoint } from '../track/trackData/waypoint';
import { Vector3 } from 'three';

describe('TrackEditorService', () => {

  const dummyElement: HTMLDivElement = document.createElement('div');
  const trackRender: TrackEditorRenderService = new TrackEditorRenderService();
  const editorService: TrackEditorService = new TrackEditorService(trackRender);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackEditorService, TrackEditorRenderService]
    });

    editorService.initialize(dummyElement);
    const waypoints: Waypoint[] = new Array<Waypoint>();
    // tslint:disable:no-magic-numbers
    waypoints.push(new Waypoint(new Vector3(0, 0, 0)));
    waypoints.push(new Waypoint(new Vector3(1, 1, 0)));
    waypoints.push(new Waypoint(new Vector3(2, 2, 0)));
    waypoints.push(new Waypoint(new Vector3(3, 10, 0)));
    // tslint:disable:no-magic-numbers
    editorService.addWaypoints(waypoints);
  });


  it('should be created', inject([TrackEditorService], (service: TrackEditorService) => {
    expect(service).toBeTruthy();
  }));

  it('track should have 4 waypoints', () => {
    expect(editorService.getTrack().getTrackSize()).toBe(4);
  });

  it('should correctly delete last waypoint', () => {
    const deletedWaypoint: Waypoint = editorService.getTrack().getLastWaypoint();
    editorService.removeWaypoint();
    expect(editorService.getTrack().getTrackSize()).toBe(3);
    expect(editorService.getTrack().getLastWaypoint().getOutgoingPlaneId()).toBeNull();
    expect(editorService.getTrack()).not.toContain(deletedWaypoint);
  });

  it('track sould be closable', () => {
    editorService.closeTrack();
    expect(editorService.getTrack().getFirstWaypoint().getIncomingPlaneId())
    .toBe(editorService.getTrack().getLastWaypoint().getOutgoingPlaneId());
  });
});
