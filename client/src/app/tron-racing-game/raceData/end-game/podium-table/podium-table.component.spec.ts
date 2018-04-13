// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodiumTableComponent } from './podium-table.component';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from '../../../../app.module';
import { routes } from '../../../../app-routes.module';
import { EndGameService } from '../end-game.service';
import { BestTimeHandlerService } from '../../recordedTimes/best-time-handler.service';
import { RaceResultsService } from '../../recordedTimes/race-results.service';

// describe('PodiumTableComponent', () => {
//     let component: PodiumTableComponent;
//     let fixture: ComponentFixture<PodiumTableComponent>;

//     let endGameService: EndGameService;
//     let bestTimesService: BestTimeHandlerService;
//     let raceResultService: RaceResultsService;


//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [routes, AppModule],
//             providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
//         })
//         .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(PodiumTableComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();

//         raceResultService = new RaceResultsService();
//         bestTimesService = new BestTimeHandlerService();

//         endGameService = new EndGameService(bestTimesService, raceResultService);
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('should not update best times if player did not finish first', () => {
//         endGameService["isFirst"] = false;
//         expect(endGameService.isFirst).toBeFalsy();
//     });
// });
