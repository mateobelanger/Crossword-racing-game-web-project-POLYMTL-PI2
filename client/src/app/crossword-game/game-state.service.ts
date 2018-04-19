import { Injectable } from "@angular/core";
import { Difficulty, PlayerType } from "../../../../common/constants";
import { NameValidator } from "../../../../common/nameValidator";

export enum GameState { NO_GAME, WAITING_FOR_OPPONENT, ONGOING, OPPONENT_LEFT }

@Injectable()
export class GameStateService {

    public hostName: string;
    public guestName: string;
    public difficulty: Difficulty;
    public isEndOfGame: boolean;
    public isMultiplayer: boolean;

    private _scores: number[];
    private _state: GameState;

    public constructor() {
        this.initializeGameState();
    }

    public get hostScore(): number {
        return this._scores[PlayerType.HOST];
    }

    public get guestScore(): number {
        return this._scores[PlayerType.GUEST];
    }

    public get isWaitingForOpponent(): boolean {
        return this._state === GameState.WAITING_FOR_OPPONENT;
    }

    public get isOngoing(): boolean {
        return this._state === GameState.ONGOING;
    }

    public get hasOponentLeft(): boolean {
        return this._state === GameState.OPPONENT_LEFT;
    }

    public initializeGameState(): void {
        this.hostName = "";
        this.guestName = "";
        this._scores = [0, 0];

        this.difficulty = null;
        this._state = GameState.NO_GAME;
        this.isMultiplayer = false;
        this.isEndOfGame = false;
    }

    public resetScores(): void {
        this._scores = [0, 0];
        this._state = GameState.ONGOING;
    }

    public startGame(): void {
        this._state = GameState.ONGOING;
    }

    public endGame(): void {
        this.isEndOfGame = false;
        this._state = GameState.NO_GAME;
        this.isMultiplayer = false;
    }

    public waitForOpponent(): void {
        this._state = GameState.WAITING_FOR_OPPONENT;
    }

    public oponentLeft(): void {
        this._state = GameState.OPPONENT_LEFT;
    }

    public setGameInfo(hostName: string, guestName: string, difficulty: Difficulty, isMultiplayer: boolean): void {
        this.hostName = hostName;
        this.guestName = guestName;
        this.difficulty = difficulty;
        this._state = GameState.ONGOING;
        this.isMultiplayer = isMultiplayer;
    }

    public updateScores(hostScore: number, guestScore: number): void {
        this._scores = [hostScore, guestScore];
    }

    public isValidState(): boolean {
        return this.difficulty !== null && NameValidator.isValidName(this.hostName) && this._state === GameState.NO_GAME;
    }
}
