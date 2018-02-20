import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-informations',
    templateUrl: './informations.component.html',
    styleUrls: ['./informations.component.css']
})
export class InformationsComponent implements OnInit {
    public difficulty: string;
    private isMultiplayer: boolean;
    private names: string[];
    private scores: number[];

    public constructor(private activatedRoute: ActivatedRoute) {
        this.difficulty = this.activatedRoute.snapshot.paramMap.get('difficulty');
        this.isMultiplayer = false;
        this.names = [];
        this.scores = [];
    }

    public ngOnInit(): void {
        this.addPlayer("Me");
    }

    private addPlayer(name: string): void {
        this.names.push(name);
        this.scores.push(0);
    }

    private removePlayer(): void {
        this.names.pop();
        this.scores.pop();
    }

    public switchMode(): void {
        if (this.isMultiplayer) {
            this.removePlayer();
            this.isMultiplayer = false;
        } else {
            this.addPlayer("Player 2");
            this.isMultiplayer = true;
        }
    }

}
