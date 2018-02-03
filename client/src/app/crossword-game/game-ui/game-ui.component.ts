import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-game-ui',
    templateUrl: './game-ui.component.html',
    styleUrls: ['./game-ui.component.css']
})
export class GameUiComponent implements OnInit {

    private difficulty: string = "default";

    public constructor(private activatedRoute: ActivatedRoute) {
        this.difficulty = this.activatedRoute.snapshot.paramMap.get('difficulty');
    }

    ngOnInit(): void {}

}
