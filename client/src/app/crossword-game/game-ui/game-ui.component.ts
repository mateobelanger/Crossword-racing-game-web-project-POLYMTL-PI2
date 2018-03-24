import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordService } from '../word.service';
import { GridService } from "../grid.service";
import { ValidatorService } from "../validator.service";

@Component({
    selector: 'app-game-ui',
    templateUrl: './game-ui.component.html',
    styleUrls: ['./game-ui.component.css'],
    providers: [WordService, ValidatorService, GridService]
})

export class GameUiComponent implements OnInit {
    public constructor(private wordService: WordService, private validator: ValidatorService,
                       private grid: GridService, private route: ActivatedRoute) {}

    public async ngOnInit(): Promise<void> {
        await this.wordService.initialize(this.route.snapshot.paramMap.get("difficulty"))
            .then(() => {
                this.grid.initialize();
                this.validator.initialize();
            });
    }

    public deselect(): void {
        this.wordService.deselect();
    }
}
