import { Injectable } from '@angular/core';
import { TrackEditorRenderService } from './track-editor-render.service';
import { Track } from '../track/track';
import { Vector2, Vector3 } from 'three';

@Injectable()
export class TrackEditorService {

  private container: HTMLDivElement;
  private track: Track;

  public constructor(private trackEditorRenderService: TrackEditorRenderService) { }

  public initialize(container: HTMLDivElement): void {
      this.container = container;
      this.track = new Track();
      this.trackEditorRenderService.initialize(container);
  }

  public getTrack(): Track {
    return this.track;
  }
  //
  // TODO : HANDLING DES CLICS GAUCHE ET DROIT
  //
  public handleLeftClick(event: MouseEvent): void {
    let elemsSelected = this.trackEditorRenderService.getObjectsPointedByMouse(event);

    if(elemsSelected.length > 0) {
      if(elemsSelected[0].object.type != "wayPpoint") {
        this.track.addWaypoint(new Vector3(
                                          (event.clientX / window.innerWidth) * 2 - 1,
                                          0,
                                          (event.clientY / window.innerHeight) * 2 + 1))
      }
    }   
  }

  public handleRightClick(event: MouseEvent): void {
    this.track.removeLastWaypoint();
  }

  public handleMouseMove(event: MouseEvent): void {
    this.trackEditorRenderService.updateMousePos(event);
  }

}
