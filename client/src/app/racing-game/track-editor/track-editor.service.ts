import { Injectable } from '@angular/core';
import { TrackEditorRenderService } from './track-editor-render.service';
import { Track } from '../track/trackData/track';
import { Waypoint } from '../track/trackData/waypoint';
import { POINTS_POSITION_Z } from '../constants';

import * as THREE from 'three';

const NB_MIN_WAYPOINTS_FOR_POLYGON: number = 3;

@Injectable()
export class TrackEditorService {

    private container: HTMLDivElement;
    private track: Track;
    private dragDropActive: boolean;
    private closedTrack: boolean;
    private selectedWaypoint: Waypoint;


    public constructor(private trackEditorRenderService: TrackEditorRenderService) { }


    public initialize(container: HTMLDivElement): void {
        this.container = container;
        this.trackEditorRenderService.initialize(this.container, this.track);
        this.track = new Track();
        this.dragDropActive = false;
        this.closedTrack = false;
    }

    public getTrack(): Track {
        return this.track;
    }

    public addWaypoints(waypoints: Waypoint[]): void {
        waypoints.forEach((waypoint) => {
            waypoint.setPositionZ(POINTS_POSITION_Z);
            this.track.addWaypoint(waypoint);
        });
        this.trackEditorRenderService.getCircleHandler().generateCircles(waypoints);
        if (this.track.getWaypointsSize() > 1) {
            if (waypoints.length === 1)
                waypoints.unshift(this.track.getPreviousToLastWaypoint());
            this.trackEditorRenderService.planeHandler.generatePlanes(waypoints, false);
        } else {
            this.track.getFirstWaypoint().bindNoPlane();
        }
      }

    public moveWaypoint(circleId: number, newPos: THREE.Vector3): void {
        const waypoint: Waypoint = this.track.getWaypoint(circleId);
        waypoint.setPosition(newPos);
        this.trackEditorRenderService.getCircleHandler().moveCircle(circleId, newPos);
        this.trackEditorRenderService.planeHandler.movedWaypoint(waypoint, newPos);
    }

    public removeWaypoint(): void {
        if (this.track.getWaypointsSize() > 0) {
            const waypoint: Waypoint = this.track.removeWaypoint();
            this.trackEditorRenderService.getCircleHandler().removeCircle(waypoint.getCircleId());
            if (this.track.getWaypointsSize() > 0) {
                const planeId: number = waypoint.getPlanesIds()[0];
                this.trackEditorRenderService.planeHandler.removePlane(planeId);
                this.track.getWaypointBindedToPlane(planeId).unbindPlane(planeId);
            }
        }
    }

    public isTrackClosable(): boolean {
        return !this.closedTrack
               && this.track.isFirstWaypoint(this.selectedWaypoint.getCircleId())
               && this.track.getWaypointsSize() >= NB_MIN_WAYPOINTS_FOR_POLYGON;
    }

    public closeTrack(): void {
        const waypoints: Waypoint[] = [this.track.getLastWaypoint(), this.track.getFirstWaypoint()];
        this.trackEditorRenderService.planeHandler.generatePlanes(waypoints, true);
    }

    public uncloseTrack(): void {
        const lastPlaneId: number = this.track.getLastWaypoint().getPlanesIds()[1];
        this.trackEditorRenderService.planeHandler.removePlane(lastPlaneId);

        this.track.getFirstWaypoint().unbindClosingPlane(lastPlaneId);
        this.track.getLastWaypoint().unbindPlane(lastPlaneId);
    }

    public handleRightMouseDown(event: MouseEvent): void {
        if (this.closedTrack) {
            this.uncloseTrack();
            this.closedTrack = false;
        } else {
            this.removeWaypoint();
        }
    }


    public handleLeftMouseDown(event: MouseEvent): void {
        const objectsSelected: THREE.Intersection[] = this.trackEditorRenderService.getObjectsPointedByMouse(event);
        const firstObjectName: string = objectsSelected[0].object.name;
        if (objectsSelected.length > 0) {
            if (firstObjectName === "point") {
                    this.selectedWaypoint = this.track.getWaypoint(objectsSelected[0].object.id);
                    if (this.selectedWaypoint != null) {
                            this.dragDropActive = true;
                        }
            } else if (!this.closedTrack && firstObjectName === "backgroundPlane")  {
                const newWaypoint: Waypoint[] = [new Waypoint(objectsSelected[0].point)];
                this.addWaypoints(newWaypoint);
            }
        }
    }

    public handleLeftMouseUp(event: MouseEvent): void {
        if (this.selectedWaypoint != null && this.isTrackClosable()) {
            this.closedTrack = true;
            this.closeTrack();
        }
        this.selectedWaypoint = null;
        this.dragDropActive = false;
    }

    public handleMouseMove(event: MouseEvent): void {
        if (this.dragDropActive) {
            this.trackEditorRenderService.updateRaycastMousePos(event);
            const backgroundPlaneSelected: THREE.Intersection[] = this.trackEditorRenderService.getBackgroundPlaneWithRaycast();
            event.preventDefault();
            backgroundPlaneSelected[0].point.z = POINTS_POSITION_Z;
            this.trackEditorRenderService.updateRaycastMousePos(event);
            this.moveWaypoint(this.selectedWaypoint.getCircleId(), backgroundPlaneSelected[0].point);
        }
    }

}

