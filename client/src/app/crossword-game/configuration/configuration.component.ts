import { Component, OnInit } from '@angular/core';
import { ConfigurationHandlerService } from '../configuration-handler.service';
import { Difficulty } from '../../../../../common/constants';

@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.css']
})

export class ConfigurationComponent implements OnInit {
    public constructor(private configurationHandlerService: ConfigurationHandlerService) {
    }

    public ngOnInit(): void {
        this.configurationHandlerService.isMultiplayer = false;
    }

    public set difficulty(difficulty: Difficulty) {
        this.configurationHandlerService.difficulty = difficulty;
    }

}
