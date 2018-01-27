import { Injectable } from '@angular/core';
import { TrackEditorRenderService } from './track-editor-render.service'; 

@Injectable()
export class TrackEditorService {

  private container: HTMLDivElement; 
 
  constructor(private trackEditorRenderService: TrackEditorRenderService) { } 
 
  public initialise(container: HTMLDivElement): void { 
      this.container = container; 
      this.trackEditorRenderService.initialise(container); 
  }   

}
