import { Component } from '@angular/core';
import { GameStateService } from '../game-state.service';

@Component({
    selector: 'app-informations',
    templateUrl: './informations.component.html',
    styleUrls: ['./informations.component.css']
})
export class InformationsComponent {

    public constructor(public gameState: GameStateService) {}

}
