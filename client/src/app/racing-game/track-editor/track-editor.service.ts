import { Injectable } from '@angular/core';
import { TrackEditorRenderService } from './track-editor-render.service';
import { Track } from '../track/trackData/track';
import { Waypoint } from '../track/trackData/waypoint';
import * as THREE from 'three';

const POINTS_POSITION_Z: number = 0;

@Injectable()
export class TrackEditorService {

    private container: HTMLDivElement;
    private track: Track;
    private dragDropActive: boolean;
    private selectedWaypoint: Waypoint;


    public constructor(private trackEditorRenderService: TrackEditorRenderService) { }

    public initialize(container: HTMLDivElement): void {
        this.container = container;
        this.trackEditorRenderService.initialize(this.container, this.track);
        this.track = new Track();
        this.dragDropActive = false;


        // TODO: remove TESTS PLAN ----------------------------------------
        // Axe X positif
        for (let i = 0; i < 5; i++) {
            const waypoint: Waypoint = new Waypoint(new THREE.Vector3(i * 60, 0, 0));
            this.track.addWaypoint(waypoint);
        }
        //Axe Y positif
        for (let i = 0; i < 5; i++) {
            const waypoint: Waypoint = new Waypoint(new THREE.Vector3(0, i * 60, 0));
            this.track.addWaypoint(waypoint);
        }

        this.addWaypoints(this.track.getWaypoints());
        // this.moveWaypoint(6, new Vector3(-200, -100 ,0));
    }

    public getTrack(): Track {
        return this.track;
    }

    public addWaypoint(waypoint: Waypoint): void {
        this.trackEditorRenderService.getCircleHandler().generateCircle(waypoint);
        // TODO: ajouter un plane si pas premier point
    }

    public addWaypoints(waypoints: Waypoint[]): void {
        this.trackEditorRenderService.getCircleHandler().generateCircles(waypoints);
        this.trackEditorRenderService.planeHandler.generatePlanes(waypoints);
        // TODO: ajouter un plan si pas premier point
      }

    public moveWaypoint(circleId: number, newPos : THREE.Vector3): void {
        const waypoint: Waypoint = this.track.getWaypoint(circleId);
        waypoint.setPosition(newPos);
        this.trackEditorRenderService.getCircleHandler().moveCircle(circleId, newPos);

        // TODO: deplacer les planes en fonction du déplacement des points
        // let dependantPlaneeId : number[] = waypoint.getPlaneesIds();
    }

/*
  public moveWaypoint(circleId: number, newPos : THREE.Vector3) {
    let waypoint : Waypoint = this.track.getWaypoint(circleId);
    waypoint.setPosition(newPos);
    this.trackEditorRenderService.circleHandler.moveCircle(circleId, newPos);
    this.trackEditorRenderService.planeHandler.moveWaypoint(waypoint.getPlanesIds(), newPos);   //TODOPLAN !!!!!!!!!!!!!!!
    console.log(waypoint.getPlanesIds());
    // TODO: deplacer les plans en fonction du déplacement des points
    //let dependantPlaneId : number[] = waypoint.getPlanesIds();
  }
  */

    public removeWaypoint(): void {
        if(this.track.getWaypointsSize() > 0) {
            const waypoint : Waypoint = this.track.removeWaypoint();
            this.trackEditorRenderService.getCircleHandler().removeCircle(waypoint.getCircleId());
        }
        // TODO: supprimer le plane dépendant
    }


/*
    public removeWaypoint(){
        let waypoint : Waypoint = this.track.removeWaypoint();
        this.trackEditorRenderService.circleHandler.removeCircle(waypoint.getCircleId());
        this.trackEditorRenderService.planeHandler.removePlane(waypoint.getPlanesIds()[1]);      //TODOPLAN !!!!!!!!!!!!!!!
    }
*/


    public handleRightMouseDown(event: MouseEvent): void {
        this.removeWaypoint();
    }


    public handleLeftMouseDown(event: MouseEvent): void {
        const objectsSelected: THREE.Intersection[] = this.trackEditorRenderService.getObjectsPointedByMouse(event);
        const firstObjectName: string = objectsSelected[0].object.name;
        if (objectsSelected.length > 0) {
            if (firstObjectName === "point") {
                    this.selectedWaypoint = this.track.getWaypoint(objectsSelected[0].object.id);
                    if(this.selectedWaypoint != undefined) {
                        this.dragDropActive = true;
                     }
            } else if (firstObjectName === "road") {
                // TODO : À compléter : Lorsqu'on click sur la piste on enlève le plan présent
                // et on  ajoute deux plan et un point
            } else if (firstObjectName === "backgroundPlane")  {
                objectsSelected[0].point.z = POINTS_POSITION_Z;
                const newWaypoint : Waypoint = this.track.addWayPointWithMouse(objectsSelected[0].point);
                this.addWaypoint(newWaypoint);
            }
        }
    }

    public handleLeftMouseUp(event: MouseEvent) : void {
        this.selectedWaypoint = null;
        this.dragDropActive = false;
    }

    public handleMouseMove(event: MouseEvent): void {
        this.trackEditorRenderService.updateRaycastMousePos(event);
        const planeSelected: THREE.Intersection[] = this.trackEditorRenderService.getBackgroundPlaneWithRaycast();

        if (this.dragDropActive) {
            event.preventDefault();
            planeSelected[0].point.z = POINTS_POSITION_Z;
            this.trackEditorRenderService.updateRaycastMousePos(event);
            this.trackEditorRenderService.getCircleHandler().moveCircle(this.selectedWaypoint.getCircleId(),  planeSelected[0].point);

        }
    }

}

