import { Injectable } from '@angular/core';
import { Difficulty } from '../../../../common/constants';

enum GameState { NO_GAME, WAITING_FOR_OPPONENT, ONGOING, WON, LOST, OPPONENT_DISCONNECTED }

@Injectable()
export class GameStateService {
    public difficulty: Difficulty;
    public username: String;
    public isMultiplayer: boolean;
    public state: GameState;
    public hostName: string;
    public opponentName: string;
    public hostScore: number;
    public opponentScore: number;

    public constructor() {
        this.username = "";
        this.isMultiplayer = false;
        this.state = null;          // NO_GAME ? verification sans onlineConfigurationcomponent.ts plus dure (import enum)
    }

    public waitForGame(): void {
        this.state = GameState.WAITING_FOR_OPPONENT;
    }
}
