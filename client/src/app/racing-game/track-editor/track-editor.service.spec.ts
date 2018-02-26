import { TestBed, inject } from '@angular/core/testing';
import { TrackEditorService } from './track-editor.service';
import { TrackEditorRenderService } from './track-editor-render.service';
import { Waypoint } from '../track/trackData/waypoint';
import { Vector3 } from 'three';

describe('TrackEditorService', () => {

    const dummyElement: HTMLDivElement = document.createElement('div');
    const trackRender: TrackEditorRenderService = new TrackEditorRenderService();
    const editorService: TrackEditorService = new TrackEditorService(trackRender);
    const SQUARE_SIDE_LENGTH: number = 100;
    const NUMBER_OF_WAYPOINTS: number = 4;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TrackEditorService, TrackEditorRenderService]
        });

        editorService.initialize(dummyElement);
        const waypoints: Waypoint[] = new Array<Waypoint>();
        waypoints.push(new Waypoint(new Vector3(-SQUARE_SIDE_LENGTH, -SQUARE_SIDE_LENGTH, 0)));
        waypoints.push(new Waypoint(new Vector3(-SQUARE_SIDE_LENGTH, SQUARE_SIDE_LENGTH, 0)));
        waypoints.push(new Waypoint(new Vector3(SQUARE_SIDE_LENGTH, SQUARE_SIDE_LENGTH, 0)));
        waypoints.push(new Waypoint(new Vector3(SQUARE_SIDE_LENGTH, -SQUARE_SIDE_LENGTH, 0)));
        editorService.addWaypoints(waypoints);
    });


    it('should be created', inject([TrackEditorService], (service: TrackEditorService) => {
        expect(service).toBeTruthy();
    }));

    it('track should have 4 waypoints', () => {
        expect(editorService.track.getTrackSize()).toBe(NUMBER_OF_WAYPOINTS);
    });

    it('should correctly delete last waypoint', () => {
        const deletedWaypoint: Waypoint = editorService.track.getLastWaypoint();
        editorService.removeWaypoint();
        expect(editorService.track.getTrackSize()).toBe(NUMBER_OF_WAYPOINTS - 1);
        expect(editorService.track.getLastWaypoint().getOutgoingPlaneId()).toBeNull();
        expect(editorService.track).not.toContain(deletedWaypoint);
    });

    it('track sould be closable', () => {
        editorService.closeTrack();
        expect(editorService.track.getFirstWaypoint().getIncomingPlaneId())
            .toBe(editorService.track.getLastWaypoint().getOutgoingPlaneId());
    });
});
