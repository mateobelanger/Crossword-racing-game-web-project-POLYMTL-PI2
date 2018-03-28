import { Component } from '@angular/core';
import { ConfigurationHandlerService } from '../configuration-handler.service';
import { Difficulty } from '../../../../../common/constants';

@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.css']
})

export class ConfigurationComponent {
    public constructor(private configurationHandlerService: ConfigurationHandlerService) {
    }

    public set difficulty(difficulty: Difficulty) {
        this.configurationHandlerService.difficulty = difficulty;
    }

}
