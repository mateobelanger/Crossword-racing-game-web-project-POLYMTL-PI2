import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.css']
})

export class ConfigurationComponent implements OnInit {
    public link: string;

    public constructor() {}

    public ngOnInit(): void {
    }

    public updateLink(difficulty: string): void {
        this.link = difficulty + "/ui";
    }

}
