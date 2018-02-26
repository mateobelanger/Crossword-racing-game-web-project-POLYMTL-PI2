import { Component, OnInit } from '@angular/core';

enum Difficulty {
    EASY = "easy",
    NORMAL = "normal",
    HARD = "hard"
}

@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.css']
})

export class ConfigurationComponent implements OnInit {
    public difficulty: Difficulty;

    public constructor() {}

    public ngOnInit(): void {
    }

    // faire des fonctions get et set et les tester dans spec.ts + PRIVATE
}
