import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routes } from '../app-routes.module';
import { TrackEditorService } from '../racing-game/track-editor/track-editor.service';

@NgModule({
  imports: [
    CommonModule,
    routes,
  ],
  declarations: [

  ],
  providers: [
    TrackEditorService
  ]
})
export class AdminModule { }
