import { Injectable } from '@angular/core';
import { Difficulty } from '../../../../common/constants';
import { NameValidator } from "../../../../common/nameValidator";

export enum GameState { NO_GAME, WAITING_FOR_OPPONENT, ONGOING, WON, LOST }

@Injectable()
export class GameStateService {
    public hostName: string;
    public guestName: string;
    public hostScore: number;
    public guestScore: number;

    public difficulty: Difficulty;
    public state: GameState;
    private _isMultiplayer: boolean;
    public _isEndOfGame: boolean;


    public constructor() {
        this.initializeGameState();
    }

    public get isMultiplayer(): boolean {
        return this._isMultiplayer;
    }

    public get isWaitingForOpponent(): boolean {
        console.log(this.state === GameState.WAITING_FOR_OPPONENT);
        return this.state === GameState.WAITING_FOR_OPPONENT;
    }

    public initializeGameState(): void {
        this.hostName = "";
        this.guestName = "";
        this.hostScore = 0;
        this.guestScore = 0;

        this.difficulty = null;
        this.state = GameState.NO_GAME;
        this._isMultiplayer = false;
        this._isEndOfGame = false;
    }

    public resetGameState(): void {
        this.hostScore = 0;
        this.guestScore = 0;
        this.state = GameState.ONGOING;
    }

    public startGame(): void {
        this.state = GameState.ONGOING;
    }

    public isOngoing(): boolean {
        return this.state === GameState.ONGOING;
    }

    public waitForOpponent(): void {
        this.state = GameState.WAITING_FOR_OPPONENT;
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
        return this.difficulty !== null && NameValidator.isValidName(this.hostName) && this.state === GameState.NO_GAME;
    }

}
