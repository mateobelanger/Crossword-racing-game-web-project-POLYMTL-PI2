import { Injectable } from '@angular/core';
import { TrackEditorRenderService } from './track-editor-render.service';

@Injectable()
export class TrackEditorService {



  private container: HTMLDivElement;

  public constructor(private trackEditorRenderService: TrackEditorRenderService) { }

  public initialize(container: HTMLDivElement): void {
      this.container = container;
      this.trackEditorRenderService.initialize(container);
  }

  //
  // TODO : HANDLING DES CLICS GAUCHE ET DROIT
  //
  public handleLeftClick(event: MouseEvent): void {
    throw new Error("Method not implemented.");
  }

  public handleRightClick(event: MouseEvent): void {
    throw new Error("Method not implemented.");
  }
}
