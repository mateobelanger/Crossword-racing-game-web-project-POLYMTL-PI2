import { Injectable } from '@angular/core';

import { GameConfiguration } from "../../../../../common/crosswordsInterfaces/gameConfiguration";
import { Difficulty } from "../../../../../common/constants";


@Injectable()
export class LobbyService {

    public onlineGames: GameConfiguration[];

    //TODO: REMOVE
    public SHOW_MOCK_DATA: boolean = true;
    public MOCK_DATA: GameConfiguration[] = [new GameConfiguration(1, "Jacque Demers", Difficulty.EASY),
                                             new GameConfiguration(6, "Jacque Demers", Difficulty.EASY),
                                             new GameConfiguration(2, "Jacque Demers", Difficulty.HARD),
                                             new GameConfiguration(3, "Jacque Demers", Difficulty.NORMAL),
                                             new GameConfiguration(4, "Jacque Demers", Difficulty.EASY),
                                             new GameConfiguration(5, "Jacque Demers", Difficulty.NORMAL)];


    public constructor() {
        this.onlineGames = this.SHOW_MOCK_DATA ? this.MOCK_DATA :  [];
    }

}
