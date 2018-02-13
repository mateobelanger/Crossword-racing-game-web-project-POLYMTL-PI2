import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.css']
})

export class ConfigurationComponent implements OnInit {
    public difficulty: string;

    public constructor() {}

    public ngOnInit(): void {
    }

    // faire des fonctions get et set et les tester dans spec.ts + PRIVATE
}
