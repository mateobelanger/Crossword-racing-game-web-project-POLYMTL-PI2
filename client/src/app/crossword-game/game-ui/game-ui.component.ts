import { Component, OnInit } from '@angular/core';
import { WordService } from '../word.service';

@Component({
    selector: 'app-game-ui',
    templateUrl: './game-ui.component.html',
    styleUrls: ['./game-ui.component.css']
})
export class GameUiComponent implements OnInit {

    public constructor(private wordSelection: WordService) {}

    public ngOnInit(): void {}

    public deselect(): void {
        this.wordSelection.deselect();
    }

}
