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


    public isNewBestTime: boolean;

    public constructor(private bestTimesHandler: BestTimeHandlerService,
                       private raceResultService: RaceResultsService ) {
        // TODO bien link la fonction : (peut-être à mettre dans NgBeforeInit)
        // this.isNewBestTime = this.bestTimesHandler.isBestTime(this.playerTotalTime);
        this.isNewBestTime = true;
    }

    public displayTimeTable(): void {
        this.displayTable = EndGameTable.TIME_TABLE;
    }

    public get raceResults(): [string, RaceResults][] {
        return this.raceResultService.raceFinalResults;
    }


    //TODO : Faudra mettre une promise pour pas que le tableau s'affiche avant d'avoir eu le best time de update sur le serveur
    public updateBestTimes(playerName: string): void {

        //const playerTotalTime: number = this.playerTotalTime;
        //TODO : J'ai juste addTime donc c'est pas encore transféré au serveur^^
        // this.bestTimesHandler.addTime([playerName, playerTotalTime]);
    }

    // TODO : Le nom du player de base 
    /*
    private get playerTotalTime(): number {
        return this.raceResultService.getPlayerRaceResults("playerDeBase").totalTime;
    }*/

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
