import { Injectable } from '@angular/core';
import { CrosswordGame } from "../../../../../common/crosswordsInterfaces/crosswordGame";

@Injectable()
export class LobbyService {

    private _multiplayerGames: CrosswordGame[];
    private _pendingGames: CrosswordGame[];

    public constructor() {
        this._multiplayerGames = [];
        this._pendingGames = [];
    }

    public get multiplayerGames(): CrosswordGame[] {
        return this._multiplayerGames;
    }

    public get pendingGames(): CrosswordGame[] {
        return this._pendingGames;
    }

    public updateGameLists(multiplayerGames: CrosswordGame[], waitingGames: CrosswordGame[]): void {
        this._multiplayerGames = multiplayerGames;
        this._pendingGames = waitingGames;
    }
}
