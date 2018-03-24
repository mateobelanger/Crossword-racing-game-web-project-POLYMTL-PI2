import { Injectable } from '@angular/core';
import { BestTimeHandlerService } from '../recordedTimes/best-time-handler.service';
import { RaceResultsService } from '../recordedTimes/race-results.service';
import { RaceResults } from '../recordedTimes/raceResults';

export enum EndGameTable {
    NO_TABLE,
    RESULT_TABLE,
    PODIUM_TABLE,
    TIME_TABLE
}

@Injectable()
export class EndGameService {

    public displayTable: EndGameTable = EndGameTable.NO_TABLE;
    public isNewBestTime: boolean = true;

    public constructor(private bestTimesHandler: BestTimeHandlerService,
                       private raceResultService: RaceResultsService ) { }

    public displayTimeTable(): void {
        this.displayTable = EndGameTable.TIME_TABLE;
    }

    public get raceResults(): [string, RaceResults][] {
        return this.raceResultService.raceFinalResults;
    }


    //TODO : Faudra mettre une promise pour pas que le tableau s'affiche avant d'avoir eu le best time de update sur le serveur
    public updateBestTimes(playerName: string): void {
        // TODO : Le nom du player de base 
        //const playerTotalTime: number = this.raceResultService.getPlayerRaceResults("playerDeBase").totalTime;
        //TODO : J'ai juste addTime donc c'est pas encore transféré au serveur^^
        // this.bestTimesHandler.addTime([playerName, playerTotalTime]);
    }

    public get bestTimes(): [string, number][] {
        return this.bestTimesHandler.bestTimes;
    }

    public displayResultTable(): void {
        this.displayTable = EndGameTable.RESULT_TABLE;
    }

    public displayPodiumTable(): void {
        this.displayTable = EndGameTable.PODIUM_TABLE;
    }
}
