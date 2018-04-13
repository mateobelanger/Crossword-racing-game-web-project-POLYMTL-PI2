import { TestBed, inject } from '@angular/core/testing';

import { InputHandlerService } from './input-handler.service';
import { RenderService } from '../../gameRendering/render-service/render.service';
import { CameraService } from '../../gameRendering/camera.service';
import { SceneLoaderService } from '../../gameRendering/scene-loader/scene-loader.service';
import { SkyboxService } from '../../gameRendering/skybox.service';
import { SceneLightsService } from '../../gameRendering/scene-lights/scene-lights.service';
import { TrackLoaderService } from '../../gameRendering/track-loader.service';
import { AudioService } from '../../audio/audio.service';
import { CarHandlerService } from '../cars/car-handler.service';
import { RaceProgressionHandlerService } from '../../raceData/raceProgression/race-progression-handler.service';
import { CollisionHandlerService } from '../collisions/collision-handler.service';
import { OutOfBoundsHandlerService } from '../collisions/out-of-bounds-handler.service';
import { RaceDataHandlerService } from '../../raceData/race-data-handler.service';
import { TracksProxyService } from '../../tracks/tracks-proxy.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BestTimeHandlerService } from '../../raceData/recordedTimes/best-time-handler.service';
import { RaceResultsService } from '../../raceData/recordedTimes/race-results.service';
import { EndGameService } from '../../raceData/end-game/end-game.service';
import { ResultsSimulatorService } from '../../raceData/simulateEndResults/results-simulator.service';
import { SpeedZonesService } from '../../virtualPlayers/speed-zones.service';
import { PortalsHandlerService } from '../../virtualPlayers/teleportation/portals-handler.service';

describe('InputHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputHandlerService, CarHandlerService, RaceProgressionHandlerService,
                  RenderService, CollisionHandlerService, CameraService, SceneLoaderService,
                  SkyboxService, OutOfBoundsHandlerService, RaceDataHandlerService, TracksProxyService,
                  SceneLightsService, TrackLoaderService, AudioService, BestTimeHandlerService,
                  RaceResultsService, EndGameService, ResultsSimulatorService,
                  HttpClient, HttpHandler, SpeedZonesService, PortalsHandlerService ]
    });
  });

  it('should be created', inject([InputHandlerService], (service: InputHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
