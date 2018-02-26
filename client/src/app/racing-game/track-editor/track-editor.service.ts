import { Injectable } from '@angular/core';
import { TrackEditorRenderService } from './track-editor-render.service';
import { Track } from '../track/trackData/track';
import { Waypoint } from '../track/trackData/waypoint';
import { POINTS_POSITION_Z, BACKGROUND_PLANE, POINT } from '../constants';
import { Constraints } from "./constrains/constraints";
import * as THREE from 'three';
import { ConstraintsError } from "./constrains/constraintsError";

const NB_MIN_WAYPOINTS_FOR_POLYGON: number = 3;
const MIN_MOVEMENT_TRESHOLD: number = 2;

@Injectable()
export class TrackEditorService {

    private _container: HTMLDivElement;
    private _track: Track;
    private _dragDropActive: boolean;
    private _selectedWaypoint: Waypoint;
    private _selectedWaypointInitialPos: THREE.Vector3;
    private _constraints: Constraints;


    public constructor(private trackEditorRenderService: TrackEditorRenderService) { }


    public initialize(container: HTMLDivElement): void {
        this._container = container;
        this.trackEditorRenderService.initialize(this._container, this._track);
        this._track = new Track();
        this._dragDropActive = false;
        this._track.isClosed = false;
        this._constraints = new Constraints();
    }

    public get track(): Track {
        return this._track;
    }

    public addWaypoints(waypoints: Waypoint[]): void {
        waypoints.forEach((waypoint) => {
            waypoint.setPositionZ(POINTS_POSITION_Z);
            this._track.addWaypoint(waypoint);
        });
        this.trackEditorRenderService._circleHandler.generateCircles(waypoints);
        if (this._track.getTrackSize() > 1) {
            if (waypoints.length === 1)
                waypoints.unshift(this._track.getPreviousToLastWaypoint());
            this.trackEditorRenderService._planeHandler.generatePlanes(waypoints);
            this._constraints.addRoads(waypoints);
            this.updateValidityOfTrack();
        }
      }

    public moveWaypoint(circleId: number, newPos: THREE.Vector3): void {
        const waypoint: Waypoint = this._track.getWaypoint(circleId);
        waypoint.setPosition(newPos);
        this.trackEditorRenderService._circleHandler.moveCircle(circleId, newPos);
        this.trackEditorRenderService._planeHandler.movedWaypoint(waypoint, newPos);
        this._constraints.movedWaypoint(waypoint, newPos);
        this.updateValidityOfTrack();
    }

    public removeWaypoint(): void {
        if (this._track.getTrackSize() > 0) {
            const waypoint: Waypoint = this._track.removeWaypoint();
            this.trackEditorRenderService._circleHandler.removeCircle(waypoint.getCircleId());
            if (this._track.getTrackSize() > 0) {
                const planeId: number = waypoint.getIncomingPlaneId();
                this.trackEditorRenderService._planeHandler.removePlane(planeId);
                this._constraints.removeRoad(planeId);
                this._track.getWaypointBindedToPlane(planeId).unbindOutgoingPlane();
            }
            this.updateValidityOfTrack();
        }
    }

    public isTrackClosable(): boolean {
        return !this._track.isClosed
               && this._track.isFirstWaypoint(this._selectedWaypoint.getCircleId())
               && this._track.getTrackSize() >= NB_MIN_WAYPOINTS_FOR_POLYGON
               && (this._selectedWaypoint.getPosition().distanceTo(this._selectedWaypointInitialPos) <= MIN_MOVEMENT_TRESHOLD);
    }

    public closeTrack(): void {
        const waypoints: Waypoint[] = [this._track.getLastWaypoint(), this._track.getFirstWaypoint()];
        this.trackEditorRenderService._planeHandler.generatePlanes(waypoints);
        this._constraints.addRoads(waypoints);
        this._constraints.closeRoad();
        this.updateValidityOfTrack();
        this._track.isClosed = true;
    }

    public uncloseTrack(): void {
        const lastPlaneId: number = this._track.getLastWaypoint().getOutgoingPlaneId();
        this.trackEditorRenderService._planeHandler.removePlane(lastPlaneId);

        this._track.getFirstWaypoint().unbindIncomingPlane();
        this._track.getLastWaypoint().unbindOutgoingPlane();

        this._track.isClosed = false;
    }

    public handleRightMouseDown(event: MouseEvent): void {
        if (this._track.isClosed) {
            this.uncloseTrack();
            this._track.isClosed = false;
        } else {
            this.removeWaypoint();
        }
    }


    public handleLeftMouseDown(event: MouseEvent): void {
        const objectsSelected: THREE.Intersection[] = this.trackEditorRenderService.getObjectsPointedByMouse(event);
        const firstObjectName: string = objectsSelected[0].object.name;
        if (objectsSelected.length > 0) {
            if (firstObjectName === POINT) {
                    this._selectedWaypoint = this._track.getWaypoint(objectsSelected[0].object.id);
                    if (this._selectedWaypoint != null) {
                            this._selectedWaypointInitialPos = this._selectedWaypoint.getPosition();
                            this._dragDropActive = true;
                        }
            } else if (!this._track.isClosed && firstObjectName === BACKGROUND_PLANE)  {
                const newWaypoint: Waypoint[] = [new Waypoint(objectsSelected[0].point)];
                this.addWaypoints(newWaypoint);
            }
        }
    }

    public handleLeftMouseUp(event: MouseEvent): void {
        if (this._selectedWaypoint != null && this.isTrackClosable()) {
            this._track.isClosed = true;
            this.closeTrack();
        }
        this._selectedWaypoint = null;
        this._dragDropActive = false;
    }

    public handleMouseMove(event: MouseEvent): void {
        if (this._dragDropActive) {
            this.trackEditorRenderService.updateRaycastMousePos(event);
            const backgroundPlaneSelected: THREE.Intersection[] = this.trackEditorRenderService.getBackgroundPlaneWithRaycast();
            event.preventDefault();
            backgroundPlaneSelected[0].point.z = POINTS_POSITION_Z;
            this.trackEditorRenderService.updateRaycastMousePos(event);
            this.moveWaypoint(this._selectedWaypoint.getCircleId(), backgroundPlaneSelected[0].point);
        }
    }
    // tslint:disable:no-console
    private updateValidityOfTrack(): void {
        const invalidsPlanesId: ConstraintsError[] = this.getInvalidPlanesId();
        console.log(invalidsPlanesId);
        if (invalidsPlanesId.length === 0) {
            this._track.isValid = true;
        } else {
            this._track.isValid = false;
            // TO DO : MODIFY TEXTURES
        }

        console.log(this._track);
    }

    private getInvalidPlanesId(): ConstraintsError[] {
        this._constraints.updateInvalidPlanes();

        return this._constraints.invalidPlanesErrors;
    }

}

