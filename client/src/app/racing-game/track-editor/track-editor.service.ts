import { Injectable } from '@angular/core';
import { TrackEditorRenderService } from './track-editor-render.service';
import { Track } from '../track/trackData/track';
import * as THREE from 'three';
import { Waypoint } from '../track/trackData/waypoint';

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

      // TODO: remove TESTS ----------------------------------------
      //Axe X positif
      for (let i = 0; i <= 24; i++) {
        let waypoint: Waypoint = new Waypoint(new THREE.Vector3(i*20,0, 0));
        this.track.addWaypoint(waypoint);       
      }
      //Axe Y positif
      for (let i = 0; i <= 19; i++) {
        let waypoint: Waypoint = new Waypoint(new THREE.Vector3(0, i*20, 0));
        this.track.addWaypoint(waypoint);       
      }
      this.addWaypoints(this.track.getWaypoints());
      //this.removeWaypoint();
      
  }

  public getTrack(): Track {
    return this.track;
  }

  public addWaypoints(waypoints : Waypoint[]){
    this.trackEditorRenderService.circleHandler.generateCircles(waypoints);
    //TODO ajouter un plan si pas premier point
  }


  public moveWaypoint(circleId: number, newPos : THREE.Vector3) {
    let waypoint : Waypoint = this.track.getWaypoint(circleId);
    waypoint.setPosition(newPos);
    this.trackEditorRenderService.circleHandler.moveCircle(circleId, newPos);

    // TODO: deplacer les plans en fonction du déplacement des points
    //let dependantPlaneId : number[] = waypoint.getPlanesIds();
  }

  public removeWaypoint(){
    let waypoint : Waypoint = this.track.removeWaypoint();
    this.trackEditorRenderService.circleHandler.removeCircle(waypoint.getCircleId());

    //TODO: supprimer le plan dépendant
  }


  public handleLeftMouseDown(event: MouseEvent): void {
    let objectsSelected = this.trackEditorRenderService.getObjectsPointedByMouse(event);

    if(objectsSelected.length > 0) {
      if(objectsSelected[0].object.type === "wayPpoint") {
      let waypoint : Waypoint = this.track.getWaypoint(objectsSelected[0].object.id);
      if(waypoint != undefined) {
        this.dragDropActive = true;
        //
        // Il faut changer le code pour faire interface entre l'objet raycasté (un 3dObject)
        // et le "waypoint" correspondant dans le array waypoints
        //
        this.selectedWaypoint = objectsSelected[0].object;
      } else {

        //
        // A MODFIER EN RAISON DE LA NOUVELLE CLASSE WAYPOINT
        //
        this.track.addWaypoint(new Waypoint(new THREE.Vector3(
                                          (event.clientX / window.innerWidth) * 2 - 1,
                                          0,
                                          (event.clientY / window.innerHeight) * 2 + 1)))
      }
      
    }   
  }

  public handleLeftMouseUp(event: MouseEvent) : void {
    this.selectedWaypoint = null;
    this.dragDropActive = false;
  }

  public handleRightMouseDown(event: MouseEvent): void {
    this.track.removeWaypoint();
  }

  public handleMouseMove(event: MouseEvent): void {
    if(this.dragDropActive) {
      this.trackEditorRenderService.updateMousePos(event);

      // À MODIFIER EN FONCTION DE LA MÉTHODE DANS TRACK
      //this.track.moveWaypoint(this.selectedWaypoint, this.trackEditorRenderService.getMousePos);
    }
  }

}
