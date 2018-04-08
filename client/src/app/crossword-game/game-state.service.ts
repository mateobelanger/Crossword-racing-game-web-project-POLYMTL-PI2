import { Injectable } from '@angular/core';
import { Difficulty } from '../../../../common/constants';

enum GameState { ONGOING, WON, LOST, OPPONENT_DISCONNECTED }

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
    }
}
