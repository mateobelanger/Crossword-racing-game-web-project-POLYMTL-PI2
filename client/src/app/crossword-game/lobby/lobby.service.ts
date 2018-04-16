import { Injectable } from '@angular/core';
import { CrosswordGame } from "../../../../../common/crosswordsInterfaces/crosswordGame";

@Injectable()
export class LobbyService {

    private _onlineGames: CrosswordGame[];
    private _pendingGames: CrosswordGame[];

    public constructor() {
        this._onlineGames = [];
        this._pendingGames = [];
    }

    public get onlineGames(): CrosswordGame[] {
        return this._onlineGames;
    }

    public get pendingGames(): CrosswordGame[] {
        return this._pendingGames;
    }

    public updateGameLists(ongoingGames: CrosswordGame[], waitingGames: CrosswordGame[]): void {
        this._onlineGames = ongoingGames;
        this._pendingGames = waitingGames;
    }
}
