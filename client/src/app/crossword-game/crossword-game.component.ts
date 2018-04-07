import { Component } from '@angular/core';
import { GameStateService } from './game-state.service';
import { Difficulty } from '../../../../common/constants';
// import { WordService } from './word.service';
// import { ValidatorService } from './validator.service';
// import { GridService } from './grid.service';

@Component({
    selector: 'app-crossword-game',
    templateUrl: './crossword-game.component.html',
    styleUrls: ['./crossword-game.component.css']
})
export class CrosswordGameComponent {

    public constructor(private gameState: GameStateService) {
        gameState.difficulty = null;
    }

    public get difficulty(): Difficulty {
        return this.gameState.difficulty;
    }

}
