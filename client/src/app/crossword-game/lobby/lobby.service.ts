import { Injectable } from '@angular/core';

import { GameConfiguration } from "../../../../../common/crosswordsInterfaces/gameConfiguration";
// import { Difficulty } from "../../../../../common/constants";


@Injectable()
export class LobbyService {

    public onlineGames: GameConfiguration[] = [];
    public waitingGames: GameConfiguration[] = [];

    public constructor() { }

}
