import { Injectable } from '@angular/core';
import { Difficulty } from '../../../../common/constants';

enum GameState { NO_GAME, WAITING_FOR_OPPONENT, ONGOING, WON, LOST, OPPONENT_DISCONNECTED }

@Injectable()
export class GameStateService {
    public difficulty: Difficulty;
    public hostName: string;
    public guestName: string;

    public isMultiplayer: boolean;
    public state: GameState;
    public hostScore: number;
    public guestScore: number;

    public constructor() {
        this.difficulty = null;
        this.hostName = "";
        this.guestName = "";

        this.isMultiplayer = false;
        this.state = null;          // NO_GAME ? verification sans onlineConfigurationcomponent.ts plus dure (import enum)
        this.hostScore = 0;
        this.guestScore = 0;
    }

    public waitForGame(): void {
        this.state = GameState.WAITING_FOR_OPPONENT;
    }

    public startGame(): void {
        this.state = GameState.ONGOING;
    }

    public setMultiplayerGameInfo(difficulty: Difficulty, hostName: string, guestName: string): void {
        this.isMultiplayer = true;
        this.difficulty = difficulty;
        this.hostName = hostName;
        // console.log(hostName);
        this.guestName = guestName;
        // console.log(guestName);
        this.startGame();
    }

    public updateScores(hostScore: number, guestScore: number): void {
        this.hostScore = hostScore;
        this.guestScore = guestScore;
    }

    public isValidState(): boolean {
        return this.difficulty && this.hostName.length > 0 && this.state === null;
    }
}
