import { Injectable } from '@angular/core';
import { Difficulty } from '../../../../common/constants';

enum GameState { ONGOING, WON, LOST, OPPONENT_DISCONNECTED }
@Injectable()
export class GameStateService {
    public difficulty: Difficulty;
    public isMultiplayer: boolean;
    public state: GameState;
    private _names: string[];
    private scores: number[];

    public constructor() {
        this.isMultiplayer = false;
    }

    public get names(): string[] {
        return this.names;
    }
}
