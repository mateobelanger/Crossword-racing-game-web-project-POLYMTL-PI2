import { Component } from '@angular/core';
import { ConfigurationHandlerService } from './configuration-handler.service';
import { Difficulty } from '../../../../common/constants';

@Component({
    selector: 'app-crossword-game',
    templateUrl: './crossword-game.component.html',
    styleUrls: ['./crossword-game.component.css'],
    providers: [ConfigurationHandlerService]
})
export class CrosswordGameComponent {

    public constructor(private configurationHandlerService: ConfigurationHandlerService) {
        configurationHandlerService.difficulty = null;
    }

    public get difficulty(): Difficulty {
        return this.configurationHandlerService.difficulty;
    }

}
