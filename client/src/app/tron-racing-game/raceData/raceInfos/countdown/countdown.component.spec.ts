import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountdownComponent } from './countdown.component';
import { RaceDataHandlerService } from '../../race-data-handler.service';
import { TracksProxyService } from '../../../tracks/tracks-proxy.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BestTimeHandlerService } from '../../recordedTimes/best-time-handler.service';
import { APP_BASE_HREF } from '@angular/common';
import { RaceResultsService } from '../../recordedTimes/race-results.service';
import { RaceProgressionHandlerService } from '../../raceProgression/race-progression-handler.service';
import { CarHandlerService } from '../../../physics&interactions/cars/car-handler.service';
import { SpeedZonesService } from '../../../virtualPlayers/speed-zones.service';
import { EndGameService } from '../../end-game/end-game.service';
import { TrackLoaderService } from '../../../gameRendering/track-loader.service';
import { ResultsSimulatorService } from '../../simulateEndResults/results-simulator.service';
import { AudioService } from '../../../audio/audio.service';
import { InputHandlerService } from '../../../physics&interactions/controller/input-handler.service';
import { RenderService } from '../../../gameRendering/render-service/render.service';
import { CameraService } from '../../../gameRendering/camera.service';
import { SceneLoaderService } from '../../../gameRendering/scene-loader/scene-loader.service';
import { SkyboxService } from '../../../gameRendering/skybox.service';
import { SceneLightsService } from '../../../gameRendering/scene-lights/scene-lights.service';
import { CollisionHandlerService } from '../../../physics&interactions/collisions/collision-handler.service';
import { OutOfBoundsHandlerService } from '../../../physics&interactions/collisions/out-of-bounds-handler.service';
import { PortalsHandlerService } from '../../../virtualPlayers/teleportation/portals-handler.service';

describe('CountdownComponent', () => {
    let component: CountdownComponent;
    let fixture: ComponentFixture<CountdownComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CountdownComponent],
            providers: [{ provide: APP_BASE_HREF, useValue: '/' },
                        RaceDataHandlerService, TracksProxyService, HttpClient, HttpHandler, BestTimeHandlerService, RaceResultsService,
                        RaceProgressionHandlerService, CarHandlerService, SpeedZonesService, EndGameService, TrackLoaderService,
                        ResultsSimulatorService, AudioService, InputHandlerService, RenderService, CameraService, SceneLoaderService,
                        SkyboxService, SceneLightsService, CollisionHandlerService, OutOfBoundsHandlerService, PortalsHandlerService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CountdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
