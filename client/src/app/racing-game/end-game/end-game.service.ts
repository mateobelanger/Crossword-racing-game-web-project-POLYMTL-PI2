import { Injectable } from '@angular/core';

export enum EndGameTable {
    NO_TABLE,
    RESULT_TABLE,
    PODIUM_TABLE,
    TIME_TABLE
}

@Injectable()
export class EndGameService {

    public displayTable: EndGameTable = EndGameTable.NO_TABLE;
    public isNewBestTime: boolean = false;

    public constructor() { }

    public displayTimeTable(): void {
        this.displayTable = EndGameTable.TIME_TABLE;
    }

    public displayResultTable(): void {
        this.displayTable = EndGameTable.RESULT_TABLE;
    }

    public displayPodiumTable(): void {
        this.displayTable = EndGameTable.PODIUM_TABLE;
    }
}
