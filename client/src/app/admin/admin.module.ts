import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routes } from '../app-routes.module';
import { TrackEditorService } from '../racing-game/track-editor/track-editor.service';
import { TrackEditorComponent } from '../racing-game/track-editor/track-editor.component';
import { TrackEditorRenderService } from '../racing-game/track-editor/track-editor-render.service';
import { AdminComponent } from './admin.component';
import { TracksProxyService } from '../racing-game/tracks-proxy.service';
@NgModule({
  imports: [
    CommonModule,
    routes,
  ],
  declarations: [
    AdminComponent,
    TrackEditorComponent
  ],
  exports: [
    AdminComponent,
  ],

  providers: [
    TrackEditorService,
    TrackEditorRenderService,
    TracksProxyService
  ]
})
export class AdminModule { }
