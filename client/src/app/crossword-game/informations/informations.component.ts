import { Component, OnInit } from '@angular/core';
// import { GameStateService } from '../game-state.service';

@Component({
    selector: 'app-informations',
    templateUrl: './informations.component.html',
    styleUrls: ['./informations.component.css']
})
export class InformationsComponent implements OnInit {
    // public difficulty: string;
    // private names: string[];
    // private scores: number[];

    // public constructor(private gameState: GameStateService) {
    //     this.names = [];
    //     this.scores = [];
    // }

    public ngOnInit(): void {
        // this.addPlayer("Me");
        // this.difficulty = this.gameState.difficulty;
    }

    // private addPlayer(name: string): void {
    //     this.names.push(name);
    //     this.scores.push(0);
    // }

}
