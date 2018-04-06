import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { routes } from "../app-routes.module";

import { GameUiComponent } from "./raceData/game-ui/game-ui.component";
import { GameFrameComponent } from "./game-frame/game-frame.component";
import { TrackListComponent } from "./track-list.component";
import { AudioService } from "./audio/audio.service";
import { RenderService } from "./gameRendering/render-service/render.service";

import { TrackEditorRenderService } from "./tracks/track-editor/track-editor-render.service";
import { TrackEditorService } from "./tracks/track-editor/track-editor.service";
import { TracksProxyService } from "./tracks/tracks-proxy.service";

import { TrackLoaderService } from "./gameRendering/track-loader.service";
import { SceneLightsService } from "./gameRendering/scene-lights/scene-lights.service";
import { SceneLoaderService } from "./gameRendering/scene-loader/scene-loader.service";
import { CameraService } from "./gameRendering/camera.service";
import { SkyboxService } from "./gameRendering/skybox.service";

import { SpeedComponent } from './raceData/raceInfos/speed/speed.component';
import { LapComponent } from './raceData/raceInfos/lap/lap.component';
import { TimeComponent } from './raceData/raceInfos/time/time.component';
import { PositionComponent } from './raceData/raceInfos/position/position.component';

import { RaceDataHandlerService } from "./raceData/race-data-handler.service";
import { BestTimesComponent } from "./raceData/end-game/time-table/time-table.component";
import { BestTimeHandlerService } from "./raceData/recordedTimes/best-time-handler.service";
import { RaceResultsService } from './raceData/recordedTimes/race-results.service';
import { TimeShowComponent } from "./raceData/end-game/time-show/time-show.component";
import { RaceProgressionHandlerService } from "./raceData/raceProgression/race-progression-handler.service";
import { ResultTableComponent } from './raceData/end-game/result-table/result-table.component';
import { EndGameService } from "./raceData/end-game/end-game.service";
import { PodiumTableComponent } from './raceData/end-game/podium-table/podium-table.component';

import { CarHandlerService } from './physics&interactions/cars/car-handler.service';
import { CollisionHandlerService } from './physics&interactions/collisions/collision-handler.service';
import { OutOfBoundsHandlerService } from "./physics&interactions/collisions/out-of-bounds-handler.service";
import { ResultsSimulatorService } from './raceData/simulateEndResults/results-simulator.service';
import { SpeedZonesService } from './virtualPlayers/speed-zones.service';

@NgModule({

  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    routes,
    FormsModule
  ],

  declarations: [
    GameUiComponent,
    TrackListComponent,
    GameFrameComponent,
    SpeedComponent,
    LapComponent,
    TimeComponent,
    PositionComponent,
    BestTimesComponent,
    TimeShowComponent,
    ResultTableComponent,
    PodiumTableComponent,
  ],

  exports: [
    TrackListComponent,
  ],

  providers: [
    RenderService,
    TrackEditorRenderService,
    TrackEditorService,
    CameraService,
    SkyboxService,
    TracksProxyService,
    AudioService,
    BestTimeHandlerService,
    TrackLoaderService,
    RaceDataHandlerService,
    SceneLightsService,
    SceneLoaderService,
    BestTimeHandlerService,
    TrackLoaderService,
    CollisionHandlerService,
    RaceResultsService,
    RaceProgressionHandlerService,
    CarHandlerService,
    OutOfBoundsHandlerService,
    EndGameService,
    ResultsSimulatorService,
    SpeedZonesService
  ],

})
export class TronRacingGameModule { }
