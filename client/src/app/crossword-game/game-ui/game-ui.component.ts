import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { WordService } from '../word.service';
import { GridService } from "../grid.service"

@Component({
    selector: 'app-game-ui',
    templateUrl: './game-ui.component.html',
    styleUrls: ['./game-ui.component.css']
})

export class GameUiComponent implements OnInit {
    public constructor(private wordService: WordService, private grid: GridService, private route: ActivatedRoute) {}

    public async ngOnInit(): Promise<void> {
        await this.wordService.initialize(this.route.snapshot.paramMap.get("difficulty"))
            .then(() => { this.grid.initialize(); })
        
    }

    public deselect(): void {
        this.wordService.deselect();
    }
}
