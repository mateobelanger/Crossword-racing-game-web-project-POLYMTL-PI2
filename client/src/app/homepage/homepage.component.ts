import { Component } from '@angular/core';
import { GameStateService } from '../crossword-game/game-state.service';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

    public constructor(public gameState: GameStateService) { }

}
