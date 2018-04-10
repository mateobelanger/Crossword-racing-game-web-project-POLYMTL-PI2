import { Injectable } from '@angular/core';
import { Difficulty } from '../../../../common/constants';

export enum GameState { NO_GAME, WAITING_FOR_OPPONENT, ONGOING, WON, LOST }

@Injectable()
export class GameStateService {
    public hostName: string;
    public guestName: string;
    public hostScore: number;
    public guestScore: number;

    public difficulty: Difficulty;
    private state: GameState;
    private _isMultiplayer: boolean;

    public constructor() {
        this.initializeGameState();
    }

    public get isMultiplayer(): boolean {
        return this._isMultiplayer;
    }

    public initializeGameState(): void {
        this.hostName = "";
        this.guestName = "";
        this.hostScore = 0;
        this.guestScore = 0;

        this.difficulty = null;
        this.state = GameState.NO_GAME;
        this._isMultiplayer = false;
    }

    public startGame(): void {
        this.state = GameState.ONGOING;
    }

    public isOngoing(): boolean {
        return this.state === GameState.ONGOING;
    }

    public setGameInfo(hostName: string, guestName: string, difficulty: Difficulty, isMultiplayer: boolean): void {
        this.hostName = hostName;
        this.guestName = guestName;
        this.difficulty = difficulty;
        this.state = GameState.ONGOING;
        this._isMultiplayer = isMultiplayer;
    }

    public updateScores(hostScore: number, guestScore: number): void {
        this.hostScore = hostScore;
        this.guestScore = guestScore;
    }

    public isValidState(): boolean {
        return this.difficulty !== null && this.isValidHostName() && this.state === GameState.NO_GAME;
    }

    private isValidHostName(): boolean {
        let containsOnlySpaces: boolean = true;
        for (const char of this.hostName) {
            if (char !== " ") {
                containsOnlySpaces = false;
                break;
            }
        }

        return this.hostName.length > 0 && !containsOnlySpaces;
    }
}
