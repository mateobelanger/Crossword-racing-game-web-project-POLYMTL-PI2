import { Injectable } from '@angular/core';
import { BestTimeHandlerService } from '../recordedTimes/best-time-handler.service';
import { RaceResultsService } from '../recordedTimes/race-results.service';
import { RaceResults } from '../recordedTimes/raceResults';
import { USERNAME } from '../../constants';
import { Subject } from 'rxjs/Subject';


export enum EndGameTable {
    NO_TABLE,
    RESULT_TABLE,
    PODIUM_TABLE,
    TIME_TABLE
}

@Injectable()
export class EndGameService {

    public displayTable: EndGameTable = EndGameTable.NO_TABLE;


    public isFirst: boolean;
    public playerTime: number;
    public endGameCycleFinished: Subject<void>;


    public constructor( private bestTimesService: BestTimeHandlerService,
                        private raceResultService: RaceResultsService) {
                            this.endGameCycleFinished = new Subject();
                        }

    public displayTimeTable(): void {
        this.displayTable = EndGameTable.TIME_TABLE;
    }

    public get raceResults(): [string, RaceResults][] {
        return this.raceResultService.raceFinalResults;
    }

    public updateBestTimes(playerName: string): void {
        if (this.isFirst) {
            this.bestTimesService.addTime([playerName, this.playerTime]);
            this.endGameCycleFinished.next();
        }
    }

    public get bestTimes(): [string, number][] {
        return this.bestTimesService.bestTimes;
    }

    public displayResultTable(): void {
        this.displayTable = EndGameTable.RESULT_TABLE;
    }

    public displayPodiumTable(): void {
        this.displayTable = EndGameTable.PODIUM_TABLE;
    }

    public endGame(isFirst: boolean): Subject<void> {
        this.isFirst = isFirst;
        this.playerTime = this.raceResultService.getPlayerRaceResults(USERNAME).totalTime;
        this.displayResultTable();

        return this.endGameCycleFinished;
    }
}
