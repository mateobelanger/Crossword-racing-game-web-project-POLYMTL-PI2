import { Injectable } from '@angular/core';

import { GameConfiguration } from "../../../../../common/crosswordsInterfaces/gameConfiguration";

@Injectable()
export class LobbyService {

    public onlineGames: GameConfiguration[];
    public waitingGames: GameConfiguration[];

    public constructor() {
        this.onlineGames = [];
        this.waitingGames = [];
    }

    public updateGameLists(ongoingGames: GameConfiguration[], waitingGames: GameConfiguration[]): void {
        this.onlineGames = ongoingGames;
        this.waitingGames = waitingGames;
    }

}
