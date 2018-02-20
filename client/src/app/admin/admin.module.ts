import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routes } from '../app-routes.module';
import { TrackEditorService } from '../racing-game/track-editor/track-editor.service';
import { TrackEditorComponent } from '../racing-game/track-editor/track-editor.component';
import { TrackEditorRenderService } from '../racing-game/track-editor/track-editor-render.service';
import { AdminComponent } from './admin.component';
import { TrackEditorUiComponent } from './track-editor-ui/track-editor-ui.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    routes,
    FormsModule
  ],
  declarations: [
    AdminComponent,
    TrackEditorComponent,
    TrackEditorUiComponent
  ],
  exports: [
    AdminComponent,
  ],

  providers: [
    TrackEditorService,
    TrackEditorRenderService
  ]
})
export class AdminModule { }
