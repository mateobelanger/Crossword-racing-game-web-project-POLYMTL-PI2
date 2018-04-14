import { Injectable } from '@angular/core';

import { CrosswordGame } from "../../../../../common/crosswordsInterfaces/crosswordGame";

@Injectable()
export class LobbyService {

    public onlineGames: CrosswordGame[];
    public waitingGames: CrosswordGame[];

    public constructor() {
        this.onlineGames = [];
        this.waitingGames = [];
    }

    public updateGameLists(ongoingGames: CrosswordGame[], waitingGames: CrosswordGame[]): void {
        this.onlineGames = ongoingGames;
        this.waitingGames = waitingGames;
    }

}
