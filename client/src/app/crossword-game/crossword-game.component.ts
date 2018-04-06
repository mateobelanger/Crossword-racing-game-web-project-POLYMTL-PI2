import { Component } from '@angular/core';
import { ConfigurationHandlerService } from './configuration-handler.service';
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

    public constructor(private configurationHandlerService: ConfigurationHandlerService) {
        configurationHandlerService.difficulty = null;
    }

    public get difficulty(): Difficulty {
        return this.configurationHandlerService.difficulty;
    }

}
