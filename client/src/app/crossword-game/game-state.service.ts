import { Injectable } from '@angular/core';
import { Difficulty } from '../../../../common/constants';

// enum GameState { NO_GAME, WAITING_FOR_OPPONENT, ONGOING, WON, LOST }

@Injectable()
export class GameStateService {
    public difficulty: Difficulty;
    public hostName: string;
    public guestName: string;

    private _isMultiplayer: boolean;
    public isOngoing: boolean;
    public hostScore: number;
    public guestScore: number;

    public constructor() {
        this.difficulty = null;
        this.hostName = "";
        this.guestName = "";

        this._isMultiplayer = false;
        this.isOngoing = false;
        this.hostScore = 0;
        this.guestScore = 0;
    }

    public setMultiplayerGameInfo(difficulty: Difficulty, hostName: string, guestName: string): void {
        this._isMultiplayer = true;
        this.difficulty = difficulty;
        this.hostName = hostName;
        this.guestName = guestName;
        this.isOngoing = true;
    }

    public updateScores(hostScore: number, guestScore: number): void {
        this.hostScore = hostScore;
        this.guestScore = guestScore;
    }

    public isValidState(): boolean {
        return this.difficulty && this.hostName.length > 0;
    }

    public get isMultiplayer(): boolean {
        return this._isMultiplayer;
    }
}
