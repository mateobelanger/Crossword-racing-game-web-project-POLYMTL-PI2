import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";


import { RacingGameComponent } from './racing-game.component';
import { GameComponent } from "./game-component/game.component";
import { RenderService } from "./render-service/render.service";
import { BasicService } from "./basic.service";
import { TrackEditorComponent } from './track-editor/track-editor.component';
import { TrackEditorRenderService } from './track-editor/track-editor-render.service';
import { TrackEditorService } from './track-editor/track-editor.service'; 
import { CameraService } from './camera.service'; 

@NgModule({
  
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule
  ],

  declarations: [
    RacingGameComponent,
    GameComponent,
    TrackEditorComponent
  ],
  
  exports: [
    RacingGameComponent,
  ],

  providers: [
    RenderService,
    BasicService,
    TrackEditorRenderService,
    TrackEditorService, 
    CameraService
  ],

})
export class RacingGameModule { }
