import { Component } from '@angular/core';
import { WordService } from '../word.service';

@Component({
    selector: 'app-game-ui',
    templateUrl: './game-ui.component.html',
    styleUrls: ['./game-ui.component.css']
})
export class GameUiComponent {

    public constructor(private wordSelection: WordService) {}

    public deselect(): void {
        this.wordSelection.deselect();
    }

}
