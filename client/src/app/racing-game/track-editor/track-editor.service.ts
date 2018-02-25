import { Injectable } from '@angular/core';
import { TrackEditorRenderService } from './track-editor-render.service';
import { Track } from '../track/trackData/track';
import { Waypoint } from '../track/trackData/waypoint';
import { POINTS_POSITION_Z, BACKGROUND_PLANE, POINT, PlaneType } from '../constants';
import { Constraints } from "./constraints/constraints";
import * as THREE from 'three';
import { ConstraintsError } from "./constraints/constraintsError";
// import { forEach } from '@angular/router/src/utils/collection';
import { Plane } from "../track/trackBuildingBlocks/plane";

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
        waypoint.position = newPos;
        this.trackEditorRenderService._circleHandler.moveCircle(circleId, newPos);
        this.trackEditorRenderService._planeHandler.movedWaypoint(waypoint, newPos);
        this._constraints.movedWaypoint(waypoint, newPos);
        this.updateValidityOfTrack();
    }

    public removeWaypoint(): void {
        if (this._track.getTrackSize() > 0) {
            const waypoint: Waypoint = this._track.removeWaypoint();
            this.trackEditorRenderService._circleHandler.removeCircle(waypoint.circleId);
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
               && this._track.isFirstWaypoint(this._selectedWaypoint.circleId)
               && this._track.getTrackSize() >= NB_MIN_WAYPOINTS_FOR_POLYGON
               && (this._selectedWaypoint.position.distanceTo(this._selectedWaypointInitialPos) <= MIN_MOVEMENT_TRESHOLD);
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
        this._track.isClosed = false;

        const lastPlaneId: number = this._track.getLastWaypoint().getOutgoingPlaneId();
        this.trackEditorRenderService._planeHandler.removePlane(lastPlaneId);
        this._constraints.removeRoad(lastPlaneId);

        this._track.getFirstWaypoint().unbindIncomingPlane();
        this._track.getLastWaypoint().unbindOutgoingPlane();

    }

    public handleRightMouseDown(event: MouseEvent): void {
        if (this._track.isClosed) {
            this.uncloseTrack();
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
                            this._selectedWaypointInitialPos = this._selectedWaypoint.position;
                            this._dragDropActive = true;
                        }
            } else if (!this._track.isClosed && firstObjectName === BACKGROUND_PLANE)  {
                const newWaypoint: Waypoint[] = [new Waypoint(objectsSelected[0].point)];
                this.addWaypoints(newWaypoint);
            }
        }
        this.updateValidityOfTrack();  // G.B.
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
            event.stopPropagation();
            backgroundPlaneSelected[0].point.z = POINTS_POSITION_Z;
            this.trackEditorRenderService.updateRaycastMousePos(event);
            this.moveWaypoint(this._selectedWaypoint.circleId, backgroundPlaneSelected[0].point);
        }
    }

    private updateValidityOfTrack(): void {
        const invalidPlaneErrors: ConstraintsError[] = this.getInvalidPlaneErrors();

        if (invalidPlaneErrors.length === 0) {
            this._track.isValid = true;
            for (const plane of this.trackEditorRenderService._planeHandler.planes) {
                this.changePlaneMaterialBasedOnValidity([], plane);
            }
        } else {
            this._track.isValid = false;
            // TO DO : MODIFY TEXTURES
            const invalidPlanesIds: number[] = this.getInvalidPlanesIds(invalidPlaneErrors);

            for (const plane of this.trackEditorRenderService._planeHandler.planes) {
                this.changePlaneMaterialBasedOnValidity(invalidPlanesIds, plane);

            }
        }

        console.log(this._track);
    }

    private changePlaneMaterialBasedOnValidity(invalidPlanesIds: number[], plane: Plane): void {
        if (plane.length === 0) {
            plane.mesh.material = invalidPlanesIds.includes(plane.id) ?
                            this.trackEditorRenderService._planeHandler.getPlaneMaterial(plane.length, PlaneType.INVALID_FIRST_PLANE) :
                            this.trackEditorRenderService._planeHandler.getPlaneMaterial(plane.length, PlaneType.VALID_FIRST_PLANE);
        } else {
            plane.mesh.material = invalidPlanesIds.includes(plane.id) ?
                                    this.trackEditorRenderService._planeHandler.getPlaneMaterial(plane.length, PlaneType.INVALID_PLANE) :
                                    this.trackEditorRenderService._planeHandler.getPlaneMaterial(plane.length, PlaneType.VALID_PLANE);
        }

    }

    private getInvalidPlanesIds(invalidPlaneErrors: ConstraintsError[]): number[] {
        const invalidPlanesIds: number[] = [];

        for (const constraintError of invalidPlaneErrors) {
            const firstInvalidPlaneId: number = constraintError.planesId[0];
            const secondInvalidPlaneId: number = constraintError.planesId[1];

            if (!invalidPlanesIds.includes(firstInvalidPlaneId) && firstInvalidPlaneId !== undefined) {
                invalidPlanesIds.push(firstInvalidPlaneId);
            }
            if (!invalidPlanesIds.includes(secondInvalidPlaneId) && secondInvalidPlaneId !== undefined) {
                invalidPlanesIds.push(secondInvalidPlaneId);
            }
        }

        return invalidPlanesIds;

    }

    private getInvalidPlaneErrors(): ConstraintsError[] {
        this._constraints.updateInvalidPlanes();

        return this._constraints.invalidPlanesErrors;
    }

}

