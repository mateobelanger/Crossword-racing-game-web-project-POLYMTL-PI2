import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";

import { RacingGameSceneComponent } from "./racing-game-scene/racing-game-scene.component";
import { RacingGameComponent } from "./racing-game.component";
import { GameComponent } from "./game-component/game.component";
import { RenderService } from "./render-service/render.service";
import { TrackEditorRenderService } from "./track-editor/track-editor-render.service";
import { TrackEditorService } from "./track-editor/track-editor.service";
import { TracksProxyService } from "../racing-game/tracks-proxy.service";
import { CameraService } from "./camera.service";
import { SkyboxService } from "./skybox.service";
import { routes } from "../app-routes.module";
import { RaceDataHandlerService } from "./race-data-handler.service";
import { SpeedComponent } from './game-infos/speed/speed.component';
import { LapComponent } from './game-infos/lap/lap.component';
import { TimeComponent } from './game-infos/time/time.component';
import { PositionComponent } from './game-infos/position/position.component';
import { BestTimesComponent } from './recordedTimes/time-table/time-table.component';
import { BestTimeHandlerService } from "./recordedTimes/best-time-handler.service";
import { RaceResultsService } from './recordedTimes/race-results.service';
import { TimeShowComponent } from './recordedTimes/time-table/time-show/time-show.component';

@NgModule({

  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    routes
  ],

  declarations: [
    RacingGameComponent,
    GameComponent,
    RacingGameSceneComponent,
    SpeedComponent,
    LapComponent,
    TimeComponent,
    PositionComponent,
    BestTimesComponent,
    TimeShowComponent,
  ],

  exports: [
    RacingGameComponent,
  ],

  providers: [
    RenderService,
    TrackEditorRenderService,
    TrackEditorService,
    CameraService,
    SkyboxService,
    TracksProxyService,
    RaceDataHandlerService,
    BestTimeHandlerService,
    RaceResultsService
  ],

})
export class RacingGameModule { }
