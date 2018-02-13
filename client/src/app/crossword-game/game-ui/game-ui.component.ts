import { Component, OnInit } from '@angular/core';
import { WordSelectionService } from '../word-selection.service';

@Component({
    selector: 'app-game-ui',
    templateUrl: './game-ui.component.html',
    styleUrls: ['./game-ui.component.css']
})
export class GameUiComponent implements OnInit {

    public constructor(private wordSelection: WordSelectionService) {}

    public ngOnInit(): void {}

    public deselect(): void {
        this.wordSelection.deselect();
    }

}
